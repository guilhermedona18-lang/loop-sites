"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  "Ambiente verificado Loop Leilões",
  "Conexão protegida e segura",
  "Catálogo oficial de veículos",
]

export function CatalogLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        return Math.min(100, p + Math.random() * 14 + 6)
      })
    }, 220)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onDone, 450)
      return () => clearTimeout(t)
    }
  }, [progress, onDone])

  return (
    <div className="px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 p-6 pb-8">
        {/* soft decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10" />
        <div className="pointer-events-none absolute right-10 top-24 size-48 rounded-full bg-primary/[0.06]" />

        <div className="relative flex flex-col items-center text-center">
          <span className="rounded-full bg-card px-5 py-2 text-xs font-bold tracking-widest text-primary">
            ACESSO PREMIUM
          </span>

          <h1 className="mt-5 font-heading text-4xl font-extrabold uppercase leading-[0.95] text-primary text-balance">
            Carregando
            <br />
            seu catálogo
          </h1>

          <div className="mt-4 flex items-center gap-2" aria-hidden>
            <span className="size-2.5 animate-pulse rounded-full bg-primary/40 [animation-delay:0ms]" />
            <span className="size-2.5 animate-pulse rounded-full bg-primary/70 [animation-delay:150ms]" />
            <span className="size-2.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
          </div>

          <p className="mt-5 max-w-[16rem] text-lg font-bold text-foreground text-pretty">
            Carregando veículos disponíveis com segurança...
          </p>

          {/* progress bar */}
          <div
            className="mt-6 h-3 w-full overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Carregando catálogo"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* checklist */}
          <div className="mt-6 w-full space-y-3">
            {items.map((label, i) => {
              const reached = progress >= (i + 1) * 24
              return (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-card px-4 py-4 shadow-sm"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
                      reached ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary/40",
                    )}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="flex-1 text-center text-sm font-bold text-foreground">
                    {label}
                  </span>
                  <span className="size-7 shrink-0" aria-hidden />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-6 px-2 text-center text-sm font-medium text-muted-foreground text-pretty">
        Preparando a melhor experiência para você. Aguarde alguns instantes.
      </p>
    </div>
  )
}
