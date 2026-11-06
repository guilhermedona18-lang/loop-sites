'use client'

import { useEffect, useRef, useState } from 'react'
import {
  MapPin,
  Flag,
  Lock,
  TriangleAlert,
  Gauge,
  Route as RouteIcon,
  Clock,
  LocateFixed,
  Maximize2,
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'

type Telemetry = {
  speedKmh: number
  remainingKm: number
  totalKm: number
  progress: number // 0..1
  etaClock: string // "14:35"
  etaHuman: string // "3h 12min"
}

const EMPTY_TELEMETRY: Telemetry = {
  speedKmh: 0,
  remainingKm: 0,
  totalKm: 0,
  progress: 0,
  etaClock: '--:--',
  etaHuman: 'calculando...',
}

// Coordenada de reserva (centro do Brasil) caso a geocodificação falhe.
const FALLBACK_ORIGIN: [number, number] = [-23.1864, -46.8842] // Jundiaí - SP
const FALLBACK_DESTINATION: [number, number] = [-15.7801, -47.9292] // Brasília - DF

/** Geocodifica um endereço em texto para [lat, lng] usando o Nominatim (OSM). */
async function geocode(
  address: string,
  fallback: [number, number],
): Promise<[number, number]> {
  if (!address?.trim()) return fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(
      address,
    )}`
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'pt-BR' },
    })
    const data = await res.json() as any
    if (Array.isArray(data) && data[0]?.lat && data[0]?.lon) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch {
    // Sem rede / limite: usa a coordenada de reserva.
  }
  return fallback
}

type LiveMapProps = {
  /** Quando true, o veículo para de se mover (mapa travado pelo admin). */
  locked?: boolean
  /** Quando true, sinaliza problema com o motorista e para o movimento. */
  problem?: boolean
  /** Endereço de saída (texto) — geocodificado para desenhar a rota real. */
  origin?: string
  /** Endereço de entrega (texto) — geocodificado para desenhar a rota real. */
  destination?: string
  /** URL da imagem que se move no mapa (guincho visto de cima). */
  vehicleImage?: string
  className?: string
}

export function LiveMap({
  locked = false,
  problem = false,
  origin = '',
  destination = '',
  vehicleImage = '/images/tow-truck-top.png',
  className,
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  pausedRef.current = locked || problem

  const followRef = useRef(true)
  const mapRef = useRef<any>(null)
  const boundsRef = useRef<any>(null)
  const truckLatLngRef = useRef<[number, number] | null>(null)

  const [tel, setTel] = useState<Telemetry>(EMPTY_TELEMETRY)
  const [following, setFollowing] = useState(true)

  useEffect(() => {
    let map: any
    let rafId: number | null = null
    let cancelled = false

    async function init() {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current) return

      map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        touchZoom: true,
      })
      mapRef.current = map

      // Botões de zoom (+/-) no canto inferior direito, longe da etiqueta.
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Quando o usuário arrasta o mapa, paramos de seguir o veículo.
      map.on('dragstart', () => {
        followRef.current = false
        setFollowing(false)
      })

      // Tiles claros (fundo praticamente branco) = mapa real de ruas.
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' },
      ).addTo(map)

      // Geocodifica os endereços salvos deste CPF -> cada CPF tem sua rota.
      const [ORIGIN, DESTINATION] = await Promise.all([
        geocode(origin, FALLBACK_ORIGIN),
        geocode(destination, FALLBACK_DESTINATION),
      ])
      if (cancelled) return

      // Busca uma rota real (que segue as ruas) via OSRM.
      let coords: [number, number][] = [ORIGIN, DESTINATION]
      let routeDurationSec = 0 // duração real da viagem (segundos), vinda do OSRM
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${ORIGIN[1]},${ORIGIN[0]};${DESTINATION[1]},${DESTINATION[0]}?overview=full&geometries=geojson`
        const res = await fetch(url)
        const data = await res.json() as any
        const line = data?.routes?.[0]?.geometry?.coordinates
        if (Array.isArray(line) && line.length > 1) {
          coords = line.map((c: [number, number]) => [c[1], c[0]])
        }
        if (typeof data?.routes?.[0]?.duration === 'number') {
          routeDurationSec = data.routes[0].duration
        }
      } catch {
        // Sem rede: cai no traçado reto entre origem e destino.
      }
      if (cancelled) return

      // Linha vermelha da rota.
      L.polyline(coords, {
        color: '#e11d2a',
        weight: 5,
        opacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map)

      // Sobreposição animada (efeito de "fluxo" igual aos apps de transporte).
      L.polyline(coords, {
        color: '#ffffff',
        weight: 2.5,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
        dashArray: '1 16',
        className: 'route-flow',
      }).addTo(map)

      // Marcadores de origem (verde) e destino (vermelho).
      const dot = (color: string) =>
        L.divIcon({
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
        })
      L.marker(coords[0], { icon: dot('#16a34a') }).addTo(map)
      L.marker(coords[coords.length - 1], { icon: dot('#e11d2a') }).addTo(map)

      // Guincho (imagem vista de cima) que percorre a rota.
      const truckIcon = L.divIcon({
        className: '',
        iconSize: [64, 40],
        iconAnchor: [32, 20],
        html: `<img src="${vehicleImage}" data-truck style="width:64px;height:40px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));transform-origin:center;transition:transform .2s linear" />`,
      })
      const truck = L.marker(coords[0], {
        icon: truckIcon,
        zIndexOffset: 1000,
      }).addTo(map)

      // Zoom aproximado (nível de ruas) centrado no guincho, câmera segue o veículo.
      const FOLLOW_ZOOM = 15
      boundsRef.current = L.latLngBounds(coords)
      map.setView(coords[0], FOLLOW_ZOOM, { animate: false })

      // Distâncias acumuladas ao longo da rota (para mover a velocidade constante).
      const segLen: number[] = []
      let total = 0
      for (let i = 0; i < coords.length - 1; i++) {
        const d = map.distance(coords[i], coords[i + 1])
        segLen.push(d)
        total += d
      }

      // Velocidade em "tempo real": o guincho leva as mesmas horas que a
      // viagem de verdade levaria (ex.: Jundiaí->Coaraci ~22h). Fica bem lento.
      // total (m) / duração real (s) = m/s reais ao longo da rota.
      const speed =
        routeDurationSec > 0
          ? total / routeDurationSec // andar no tempo real da viagem
          : 12 // fallback caso o OSRM não informe a duração
      let travelled = 0
      let last: number | null = null
      let lastEmit = 0

      function emitTelemetry(t: number) {
        const remaining = Math.max(total - travelled, 0)
        const paused = pausedRef.current
        // Pequena flutuação para parecer "ao vivo" (± alguns km/h).
        const baseKmh = speed * 3.6
        const speedKmh = paused
          ? 0
          : Math.max(0, baseKmh + Math.sin(t / 2200) * 6)
        const remainingSec = speed > 0 ? remaining / speed : 0
        const arrival = new Date(Date.now() + remainingSec * 1000)
        const etaClock = paused
          ? '--:--'
          : arrival.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
        const h = Math.floor(remainingSec / 3600)
        const m = Math.round((remainingSec % 3600) / 60)
        const etaHuman = paused
          ? 'pausado'
          : h > 0
            ? `${h}h ${m}min`
            : `${m}min`
        setTel({
          speedKmh: Math.round(speedKmh),
          remainingKm: remaining / 1000,
          totalKm: total / 1000,
          progress: total > 0 ? travelled / total : 0,
          etaClock,
          etaHuman,
        })
      }

      function frame(t: number) {
        if (last == null) last = t
        const dt = (t - last) / 1000
        last = t

        if (!pausedRef.current) {
          travelled += speed * dt
          if (travelled >= total) travelled = 0
        }

        // Atualiza os indicadores (ETA, velocidade, distância) ~2x por segundo.
        if (t - lastEmit > 500) {
          lastEmit = t
          emitTelemetry(t)
        }

        // Encontra o segmento atual.
        let acc = 0
        let i = 0
        while (i < segLen.length && acc + segLen[i] < travelled) {
          acc += segLen[i]
          i++
        }
        const a = coords[Math.min(i, coords.length - 1)]
        const b = coords[Math.min(i + 1, coords.length - 1)]
        const frac = segLen[i] ? (travelled - acc) / segLen[i] : 0
        const lat = a[0] + (b[0] - a[0]) * frac
        const lng = a[1] + (b[1] - a[1]) * frac
        truck.setLatLng([lat, lng])
        truckLatLngRef.current = [lat, lng]

        // Câmera acompanha o guincho respeitando o zoom escolhido pelo usuário.
        // Se o usuário arrastou o mapa (followRef=false), não força o centro.
        if (followRef.current) {
          map.setView([lat, lng], map.getZoom(), { animate: false })
        }

        // Rotaciona a imagem na direção do movimento.
        const pa = map.latLngToLayerPoint(a)
        const pb = map.latLngToLayerPoint(b)
        const angle =
          (Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180) / Math.PI
        const el = truck.getElement()?.querySelector('[data-truck]') as
          | HTMLElement
          | undefined
        if (el) el.style.transform = `rotate(${angle + 180}deg)`

        rafId = requestAnimationFrame(frame)
      }
      rafId = requestAnimationFrame(frame)
    }

    init()

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (map) map.remove()
    }
  }, [vehicleImage, origin, destination])

  const paused = locked || problem
  const pct = Math.round(tel.progress * 100)

  function recenter() {
    followRef.current = true
    setFollowing(true)
    const map = mapRef.current
    const at = truckLatLngRef.current
    if (map && at) map.setView(at, 15, { animate: true })
  }

  function showWholeRoute() {
    followRef.current = false
    setFollowing(false)
    const map = mapRef.current
    if (map && boundsRef.current) {
      map.fitBounds(boundsRef.current, { padding: [30, 30] })
    }
  }

  return (
    <div className={className}>
      {/* Animação da linha vermelha (fluxo estilo apps de transporte). */}
      <style>{`
        .route-flow { animation: routeFlow 1.1s linear infinite; }
        @keyframes routeFlow { to { stroke-dashoffset: -34; } }
      `}</style>

      <div className="relative">
        <div
          ref={containerRef}
          className="h-64 w-full bg-white sm:h-72"
          role="img"
          aria-label="Mapa de rastreio ao vivo com rota real em tempo real"
        />

        {/* Etiqueta de velocidade sobre o mapa (canto superior). */}
        <div className="pointer-events-none absolute left-3 top-3 z-[500] flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm backdrop-blur">
          <Gauge className="size-3.5 text-primary" aria-hidden="true" />
          {paused ? '0' : tel.speedKmh} km/h
        </div>

        {/* Controles de câmera: seguir veículo / ver rota toda. */}
        <div className="absolute right-3 top-3 z-[500] flex flex-col gap-2">
          <button
            type="button"
            onClick={recenter}
            aria-label="Seguir o veículo"
            className={
              'flex size-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-colors ' +
              (following
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/90 text-foreground hover:bg-card')
            }
          >
            <LocateFixed className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showWholeRoute}
            aria-label="Ver a rota inteira"
            className="flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
          >
            <Maximize2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Barra de progresso da viagem */}
      <div className="px-4 pt-3">
        <div className="mb-1.5 flex items-center justify-between text-[0.7rem] font-bold text-muted-foreground">
          <span>Progresso da viagem</span>
          <span className="text-foreground">{pct}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Indicadores estilo Uber: chegada, distância restante, velocidade */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <Stat
          icon={<Clock className="size-4" aria-hidden="true" />}
          label="Chega às"
          value={tel.etaClock}
          hint={paused ? 'pausado' : tel.etaHuman}
        />
        <Stat
          icon={<RouteIcon className="size-4" aria-hidden="true" />}
          label="Faltam"
          value={`${tel.remainingKm.toFixed(0)} km`}
          hint={`de ${tel.totalKm.toFixed(0)} km`}
        />
        <Stat
          icon={<Gauge className="size-4" aria-hidden="true" />}
          label="Velocidade"
          value={`${paused ? 0 : tel.speedKmh}`}
          hint="km/h"
        />
      </div>

      {/* Faixa de status sobre o mapa */}
      {(locked || problem) && (
        <div
          className={
            'mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold ' +
            (problem
              ? 'bg-amber-500/15 text-amber-600'
              : 'bg-muted text-muted-foreground')
          }
        >
          {problem ? (
            <>
              <TriangleAlert className="size-4" aria-hidden="true" />
              Motorista com problema — rastreio pausado
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden="true" />
              Rastreio travado
            </>
          )}
        </div>
      )}
    </div>
  )
}

/** Cartão compacto de indicador (ETA, distância, velocidade). */
function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-card px-2 py-2.5 text-center">
      <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <span className="text-base font-bold leading-none text-foreground">
        {value}
      </span>
      <span className="text-[0.65rem] text-muted-foreground">{hint}</span>
    </div>
  )
}

/** Selos de origem e destino exibidos abaixo do mapa. */
export function TrackingAddresses({
  origin,
  destination,
}: {
  origin: string
  destination: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
          <MapPin className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">
            Endereço de saída
          </p>
          <p className="text-sm font-medium text-pretty text-foreground">
            {origin || 'Não informado'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-primary">
          <Flag className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">
            Endereço de entrega
          </p>
          <p className="text-sm font-medium text-pretty text-foreground">
            {destination || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  )
}
