"use client"

import { BadgeCheck, Star } from "lucide-react"
import { testimonials, type Testimonial } from "@/lib/loop-data"

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "size-3.5 fill-amber-400 text-amber-400"
              : "size-3.5 fill-muted text-muted"
          }
        />
      ))}
    </div>
  )
}

function Card({ t }: { t: Testimonial }) {
  return (
    <article className="w-[85%] shrink-0 snap-start rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: t.color }}
          >
            {t.initials}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">{t.name}</p>
            <Stars rating={t.rating} />
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
          <BadgeCheck className="size-3" />
          Verificado
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {t.text}
      </p>
    </article>
  )
}

export function Testimonials() {
  const periods = Array.from(new Set(testimonials.map((t) => t.period)))

  return (
    <section className="px-4 pt-8">
      <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
        Depoimentos
      </span>
      <h2 className="mt-1 font-heading text-2xl font-extrabold leading-tight text-foreground text-balance">
        Comentários de quem comprou carro na Loop
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Avaliações verificadas com notas reais de 3, 4 e 5 estrelas.
      </p>

      <div className="mt-5 space-y-6">
        {periods.map((period) => {
          const items = testimonials.filter((t) => t.period === period)
          return (
            <div key={period}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  {period}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Deslize
                </span>
              </div>
              <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((t) => (
                  <Card key={t.id} t={t} />
                ))}
                {/* repeat for fuller carousel feel */}
                {items.map((t) => (
                  <Card key={`${t.id}-b`} t={t} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
