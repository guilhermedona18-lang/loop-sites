"use client"

import { ArrowRight, Gavel } from "lucide-react"
import { useLoop } from "../store"
import { VehicleCard } from "../vehicle-card"
import { LotesStrip } from "../lotes-strip"

export function FeaturedVehicles() {
  const { vehicles, category, setTab } = useLoop()

  const filtered = vehicles.filter(
    (v) => category === "todos" || v.category === category,
  )

  if (vehicles.length === 0) return null

  return (
    <section className="bg-background px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <Gavel className="size-3.5" />
            Leilão
          </div>
          <h2 className="mt-1 font-heading text-2xl font-extrabold leading-tight text-foreground text-balance">
            Ofertas disponíveis
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Encontre os melhores veículos e dê o seu lance.
          </p>
        </div>
      </div>

      <LotesStrip vehicles={filtered} />

      <div className="mt-4 space-y-4">
        {filtered.slice(0, 4).map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum veículo nesta categoria no momento.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setTab("buscar")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition active:scale-[0.99]"
      >
        Ver todos os veículos
        <ArrowRight className="size-4" />
      </button>
    </section>
  )
}
