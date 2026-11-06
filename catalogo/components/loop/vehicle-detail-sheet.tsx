"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Images,
  Video,
  ShieldCheck,
  MapPin,
  Map,
  Cog,
  Fuel,
  Gauge,
  CalendarDays,
  Heart,
  DollarSign,
  Users,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop } from "./store"
import type { Vehicle } from "@/lib/loop-data"
import { VideoModal } from "./video-modal"
import { FichaTecnica } from "./views/ficha-tecnica"
import { TrustCard } from "./trust-card"
import { GoodNewsPopup } from "./good-news-popup"
import { FinancialSummary } from "./financial-summary"

const LOCATION = "Loop Brasil - Unidade Mogi das Cruzes"
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Loop+Leiloes+Mogi+das+Cruzes"

function brl(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}

// hash estável a partir do id
function loteNumberValue(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9999
  return h + 1
}

// número de lote estável a partir do id
function loteNumber(id: string) {
  return String(loteNumberValue(id)).padStart(4, "0")
}

type Tab = "fotos" | "videos" | "cautelar"

export function VehicleDetailSheet({
  vehicle,
  open,
  onClose,
  onSimulate,
}: {
  vehicle: Vehicle
  open: boolean
  onClose: () => void
  onSimulate: () => void
}) {
  const { isFavorite, toggleFavorite, setTab: setAppTab } = useLoop()

  // Valor total com taxas: lance + comissão do leiloeiro (5%) + taxa administrativa fixa
  const totalWithFees = Math.round(vehicle.price * 1.05) + 890
  // Espectadores "ao vivo" estáveis por veículo (não muda a cada render)
  const viewers = 90 + (loteNumberValue(vehicle.id) % 220)
  const gallery = vehicle.images?.length ? vehicle.images : [vehicle.image]
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState<Tab>("fotos")
  const [videoOpen, setVideoOpen] = useState(false)
  const [goodNews, setGoodNews] = useState(false)
  const trustRef = useRef<HTMLDivElement>(null)
  const shownRef = useRef(false)
  const fav = isFavorite(vehicle.id)
  const available = (vehicle.status as string) !== "encerrado"

  useEffect(() => {
    if (!open) return
    setIndex(0)
    setTab("fotos")
    setGoodNews(false)
    shownRef.current = false
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  // Dispara o popup comemorativo quando o card de confiança entra na tela
  useEffect(() => {
    if (!open || !available) return
    const el = trustRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !shownRef.current) {
            shownRef.current = true
            setGoodNews(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [open, available])

  if (!open) return null

  const prev = () => setIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === gallery.length - 1 ? 0 : i + 1))

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={vehicle.name}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 animate-in fade-in duration-200"
      />

      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* topo fixo */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-90"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-heading text-sm font-bold text-foreground">Detalhes do lote</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition active:scale-90"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* conteúdo rolável */}
        <div className="flex-1 overflow-y-auto pb-6">
          <div className="px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-primary">
                  Lote {loteNumber(vehicle.id)}
                </span>
                <h2 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-foreground text-balance">
                  {vehicle.name}
                </h2>
                <p className="text-sm font-semibold text-muted-foreground">{vehicle.year}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(vehicle.id)}
                aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                aria-pressed={fav}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary transition active:scale-90"
              >
                <Heart className={cn("size-5", fav ? "fill-primary text-primary" : "text-muted-foreground")} />
              </button>
            </div>
          </div>

          {/* carrossel */}
          <div className="relative mt-4 px-4">
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={gallery[index] || "/placeholder.svg"}
                alt={`${vehicle.name} - foto ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 440px"
                priority
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md transition active:scale-90"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md transition active:scale-90"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/70 px-2.5 py-0.5 text-[11px] font-semibold text-background">
                    {index + 1} / {gallery.length}
                  </span>
                </>
              )}
              <div className="absolute bottom-3 right-3 overflow-hidden rounded-lg text-center shadow-md">
                <p className="bg-foreground/80 px-2 py-0.5 text-[9px] font-bold text-background">IPVA 2026</p>
                <p className="bg-primary px-2 py-1 text-xs font-extrabold text-primary-foreground">PAGO!</p>
              </div>
            </div>
          </div>

          {/* abas */}
          <div className="mt-4 grid grid-cols-3 gap-2 px-4">
            {(
              [
                { key: "fotos", label: "Fotos", icon: Images },
                { key: "videos", label: "Vídeos", icon: Video },
                { key: "cautelar", label: "Cautelar", icon: ShieldCheck },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => (t.key === "videos" ? setVideoOpen(true) : setTab(t.key))}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-bold transition",
                  tab === t.key
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "cautelar" && (
            <p className="mx-4 mt-3 rounded-xl bg-secondary px-4 py-3 text-center text-xs text-muted-foreground">
              Laudo cautelar disponível mediante solicitação ao representante.
            </p>
          )}

          {/* valor */}
          <div className="mx-4 mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="flex items-center gap-2 font-heading text-sm font-bold text-emerald-700">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              Valor Final do Lance
            </p>
            <p className="mt-0.5 text-xs text-emerald-700/80">
              Este veículo está disponível para consulta neste momento.
            </p>
          </div>

          <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary">
                  <DollarSign className="size-4" />
                </span>
                <p className="text-[11px] text-muted-foreground">Lance inicial</p>
              </div>
              <p className="mt-2 font-heading text-lg font-extrabold text-foreground">{brl(vehicle.price)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary">
                  <Calculator className="size-4" />
                </span>
                <p className="text-[11px] text-muted-foreground">Valor total com taxas</p>
              </div>
              <p className="mt-2 font-heading text-lg font-extrabold text-foreground">{brl(totalWithFees)}</p>
            </div>
          </div>

          {/* CTA principal de simulação */}
          <div className="mx-4 mt-3">
            <button
              type="button"
              onClick={onSimulate}
              className="flex w-full items-center justify-between gap-2 rounded-2xl bg-primary px-5 py-4 font-heading text-base font-extrabold text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Calculator className="size-5" />
                Fazer simulação agora
              </span>
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* prova social ao vivo */}
          <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Users className="size-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-extrabold text-foreground">
                  {viewers} pessoas
                </p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  visualizando este anúncio agora · monitoramento seguro em tempo real
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              AO VIVO
            </span>
          </div>

          {/* cadastro */}
          <button
            type="button"
            onClick={() => {
              onClose()
              setAppTab("conta")
            }}
            className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 font-heading text-sm font-bold text-foreground transition active:scale-95"
          >
            Entrar ou criar cadastro para simular
            <Lock className="size-4 text-muted-foreground" />
          </button>

          {/* alta procura */}
          <p className="mx-4 mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            Valor Final do Lance! Esse lote está com alta procura.
          </p>

          {/* localização */}
          <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-[11px] text-muted-foreground">Localização do veículo</p>
                <p className="font-heading text-sm font-bold text-foreground">{LOCATION}</p>
              </div>
            </div>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground transition active:scale-95"
            >
              <Map className="size-4 text-primary" />
              Ver no mapa
            </a>
          </div>

          {/* dados principais */}
          <div className="mx-4 mt-3 grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border border-border bg-card p-4">
            <Spec icon={Cog} label="Câmbio" value={vehicle.transmission} />
            <Spec icon={Fuel} label="Combustível" value={vehicle.fuel} />
            <Spec icon={Gauge} label="Km" value={vehicle.km} />
            <Spec icon={CalendarDays} label="Ano" value={vehicle.year} />
          </div>

          {/* ficha técnica */}
          <div className="mt-5 px-4">
            <FichaTecnica vehicle={vehicle} km={vehicle.km} />
          </div>

          {/* confiança e transparência */}
          <div ref={trustRef} className="mt-4 px-4">
            <TrustCard active={available} />
          </div>

          {/* resumo financeiro */}
          <div className="mt-4 px-4 pb-4">
            <FinancialSummary vehicle={vehicle} />
          </div>
        </div>

      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        vehicleName={vehicle.name}
      />

      {goodNews && (
        <GoodNewsPopup
          vehicle={vehicle}
          onClose={() => setGoodNews(false)}
          onDetails={() => setGoodNews(false)}
          onSimulate={() => {
            setGoodNews(false)
            onSimulate()
          }}
        />
      )}
    </div>
  )
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cog
  label: string
  value: string
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-0.5 font-heading text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}

