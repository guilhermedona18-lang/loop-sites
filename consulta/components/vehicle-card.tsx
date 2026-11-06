'use client'

import { useState } from 'react'
import {
  Car,
  Cog,
  Calendar,
  Palette,
  Fuel,
  Gauge,
  CircleCheck,
  ChevronDown,
  FileText,
  CalendarClock,
  Gavel,
  Receipt,
} from 'lucide-react'
import { type Vehicle, formatCurrency } from '@/lib/vehicles'

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(true)
  const total = vehicle.wonValue + vehicle.adminFee

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        {/* Photo + title */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative shrink-0 overflow-hidden rounded-xl sm:w-40">
            <img
              src={vehicle.imageUrl || '/placeholder.svg'}
              alt={`Foto do veículo ${vehicle.fullTitle}`}
              className="h-32 w-full object-cover sm:h-full"
            />
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-bold text-success-foreground">
              <CircleCheck className="size-3.5" aria-hidden="true" />
              Arrematado
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-balance text-base font-bold leading-snug">
              {vehicle.fullTitle}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                Lote: {vehicle.lot}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                Leilão: {vehicle.auction}
              </span>
            </div>
          </div>
        </div>

        {/* Success banner */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-success">
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
            Parabéns! Este veículo foi arrematado por você.
          </span>
          <ChevronDown
            className={`size-5 shrink-0 text-success transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4">
          {/* Vehicle data */}
          <h4 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Car className="size-4" aria-hidden="true" />
            Dados do veículo
          </h4>
          <div className="mt-2 border-t border-border pt-2">
            <DataRow icon={Car} label="Marca/Modelo:" value={vehicle.brandModel} />
            <DataRow icon={Cog} label="Versão:" value={vehicle.version} />
            <DataRow icon={Calendar} label="Ano/Modelo:" value={vehicle.year} />
            <DataRow icon={Palette} label="Cor:" value={vehicle.color} />
            <DataRow icon={Fuel} label="Combustível:" value={vehicle.fuel} />
            <DataRow icon={Gauge} label="Quilometragem:" value={vehicle.mileage} />
            <DataRow icon={FileText} label="Situação:" value={vehicle.status} />
          </div>

          {/* Purchase info */}
          <h4 className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
            <Receipt className="size-4" aria-hidden="true" />
            Informações da compra
          </h4>
          <div className="mt-2 border-t border-border pt-2">
            <DataRow
              icon={CalendarClock}
              label="Data do leilão:"
              value={vehicle.auctionDate}
            />
            <DataRow
              icon={Gavel}
              label="Valor arrematado:"
              value={formatCurrency(vehicle.wonValue)}
            />
            <DataRow
              icon={Receipt}
              label="Taxa administrativa:"
              value={formatCurrency(vehicle.adminFee)}
            />
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-accent px-4 py-3">
            <span className="text-sm font-bold text-foreground">Valor total:</span>
            <span className="text-xl font-extrabold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </article>
  )
}
