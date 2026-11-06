"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import confetti from "canvas-confetti"
import { X, Calculator, ArrowRight } from "lucide-react"
import type { Vehicle } from "@/lib/loop-data"

export function GoodNewsPopup({
  vehicle,
  onClose,
  onDetails,
  onSimulate,
}: {
  vehicle: Vehicle
  onClose: () => void
  onDetails: () => void
  onSimulate: () => void
}) {
  const firedRef = useRef(false)

  // Efeito de festa: confete subindo assim que o popup aparece
  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const colors = ["#e11d48", "#22c55e", "#f59e0b", "#3b82f6", "#ffffff"]

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.9 },
        colors,
        disableForReducedMotion: true,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      })
    }

    // estouro central subindo
    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    // jatos laterais subindo dos cantos
    const sides = [
      { x: 0.05, angle: 60 },
      { x: 0.95, angle: 120 },
    ]
    sides.forEach((s) => {
      confetti({
        particleCount: 60,
        angle: s.angle,
        spread: 55,
        origin: { x: s.x, y: 1 },
        startVelocity: 55,
        colors,
        disableForReducedMotion: true,
      })
    })
  }, [])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Boa notícia para você"
    >
      {/* fundo escurecido */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
      />

      {/* card */}
      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl bg-card shadow-2xl duration-300">
        {/* foto */}
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={vehicle.image || vehicle.images?.[0] || "/placeholder.svg"}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 384px"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-foreground/40 text-background backdrop-blur-sm transition active:scale-90"
          >
            <X className="size-5" />
          </button>

          {/* selo disponível */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-card/95 px-3 py-1.5 shadow-lg">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              Disponível agora
            </span>
          </div>
        </div>

        {/* conteúdo */}
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Boa notícia para você
          </p>
          <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase leading-tight text-foreground text-balance">
            {vehicle.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Este veículo está disponível neste momento. Faça uma simulação sem
            compromisso e descubra a melhor forma de adquiri-lo com segurança,
            transparência e apoio oficial da Loop.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={onDetails}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-base font-bold text-foreground shadow-sm transition active:scale-[0.99]"
            >
              Ver mais sobre o veículo
              <ArrowRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={onSimulate}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99]"
            >
              <Calculator className="size-5" />
              Fazer simulação agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
