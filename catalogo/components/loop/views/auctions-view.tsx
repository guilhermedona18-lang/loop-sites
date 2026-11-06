"use client"

import { Gavel, Radio } from "lucide-react"
import { useLoop } from "../store"
import { VehicleCard } from "../vehicle-card"
import { LotesStrip } from "../lotes-strip"

export function AuctionsView() {
  const { vehicles } = useLoop()
  const ending = vehicles.filter((v) => v.status === "encerrando")
  const open = vehicles.filter((v) => v.status !== "encerrando")

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between rounded-3xl bg-ink p-5 text-ink-foreground">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
            <Radio className="size-3" />
            AO VIVO
          </span>
          <h1 className="mt-2 font-heading text-2xl font-extrabold">
            Leilões abertos
          </h1>
          <p className="mt-1 text-sm text-ink-foreground/70">
            {vehicles.length} lotes disponíveis agora.
          </p>
        </div>
        <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Gavel className="size-7" />
        </span>
      </div>

      <LotesStrip vehicles={vehicles} />

      {ending.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Encerrando em breve
          </h2>
          <div className="mt-3 space-y-4">
            {ending.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Todos os lotes
        </h2>
        <div className="mt-3 space-y-4">
          {open.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>
    </div>
  )
}
