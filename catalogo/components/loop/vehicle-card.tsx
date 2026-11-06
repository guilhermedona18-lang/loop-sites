"use client"

import { useState } from "react"
import Image from "next/image"
import { Gauge, Heart, Calculator, Cog, Fuel, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop } from "./store"
import type { Vehicle } from "@/lib/loop-data"
import { SimulationModal } from "./simulation-modal"
import { VehicleDetailSheet } from "./vehicle-detail-sheet"

const statusLabel: Record<Vehicle["status"], string> = {
  aberto: "Lances abertos",
  encerrando: "Encerrando",
  novo: "Novo lote",
}

const statusStyle: Record<Vehicle["status"], string> = {
  aberto: "bg-emerald-50 text-emerald-600",
  encerrando: "bg-accent text-primary",
  novo: "bg-blue-50 text-blue-600",
}

function brl(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { isFavorite, toggleFavorite } = useLoop()
  const fav = isFavorite(vehicle.id)
  const gallery = vehicle.images?.length ? vehicle.images : [vehicle.image]
  const [simOpen, setSimOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          aria-label={`Ver detalhes de ${vehicle.name}`}
          className="block w-full"
        >
          <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[16/10] w-full shrink-0 snap-center bg-secondary"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${vehicle.name} - foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ))}
          </div>
        </button>

        <span
          className={cn(
            "pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold",
            statusStyle[vehicle.status],
          )}
        >
          {statusLabel[vehicle.status]}
        </span>

        {gallery.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-foreground/70 px-2 py-0.5 text-[10px] font-semibold text-background">
            {gallery.length} fotos
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(vehicle.id)}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={fav}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 shadow transition active:scale-90"
        >
          <Heart
            className={cn(
              "size-5",
              fav ? "fill-primary text-primary" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          {vehicle.name}
        </h3>
        {vehicle.version && (
          <p className="mt-0.5 text-xs text-muted-foreground">{vehicle.version}</p>
        )}
        {vehicle.note && (
          <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-primary">
            {vehicle.note}
          </span>
        )}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Gauge className="size-3.5" />
            {vehicle.km}
          </span>
          <span className="inline-flex items-center gap-1">
            <Cog className="size-3.5" />
            {vehicle.transmission}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="size-3.5" />
            {vehicle.fuel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Palette className="size-3.5" />
            {vehicle.color}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Lance inicial</p>
            <p className="font-heading text-xl font-extrabold text-foreground">
              {brl(vehicle.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Ano {vehicle.year}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition active:scale-95"
          >
            <Calculator className="size-4" />
            Fazer simulação
          </button>
        </div>
      </div>

      <VehicleDetailSheet
        vehicle={vehicle}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSimulate={() => {
          setDetailOpen(false)
          setSimOpen(true)
        }}
      />

      <SimulationModal
        open={simOpen}
        onClose={() => setSimOpen(false)}
        vehicleName={vehicle.name}
      />
    </article>
  )
}
