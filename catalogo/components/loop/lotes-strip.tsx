"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Vehicle } from "@/lib/loop-data"
import { VehicleDetailSheet } from "./vehicle-detail-sheet"
import { SimulationModal } from "./simulation-modal"

/** Número de lote estável derivado da posição do veículo na lista. */
function loteLabel(index: number) {
  return `Lote ${String(index + 1).padStart(4, "0")}`
}

export function LotesStrip({ vehicles }: { vehicles: Vehicle[] }) {
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [simOpen, setSimOpen] = useState(false)

  if (vehicles.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {vehicles.map((v, i) => {
          const src = v.images?.length ? v.images[0] : v.image
          const isActive = selected?.id === v.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setSelected(v)
                setDetailOpen(true)
              }}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center"
              aria-label={`Ver ${v.name} (${loteLabel(i)})`}
            >
              <span
                className={cn(
                  "flex size-16 items-center justify-center rounded-full transition",
                  isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "",
                )}
              >
                <span className="relative size-14 overflow-hidden rounded-full border border-border bg-secondary">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </span>
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {loteLabel(i)}
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <>
          <VehicleDetailSheet
            vehicle={selected}
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
            vehicleName={selected.name}
          />
        </>
      )}
    </div>
  )
}
