import { MapPin, Camera, Info } from 'lucide-react'
import type { CustomerExtra } from '@/lib/vehicles'

/**
 * Mostra a foto e o endereço do local de entrega cadastrados pelo admin para o
 * CPF consultado. Só é renderizado quando há foto ou endereço.
 */
export function DeliveryLocation({ extra }: { extra: CustomerExtra }) {
  const hasPhoto = Boolean(extra.deliveryPhoto)
  const hasAddress = Boolean(extra.deliveryAddress)
  const hasNotes = Boolean(extra.notes)

  if (!hasPhoto && !hasAddress && !hasNotes) return null

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-3.5 text-card-foreground shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
          <MapPin className="size-4" aria-hidden="true" />
        </span>
        Local de entrega
      </h3>

      <p className="mt-2 text-xs leading-snug text-muted-foreground">
        Este é o local onde o seu veículo será disponibilizado para entrega.
      </p>

      {hasPhoto && (
        <div className="mt-2.5 overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={extra.deliveryPhoto || '/placeholder.svg'}
            alt="Foto do local de entrega do veículo"
            className="h-44 w-full object-cover"
          />
        </div>
      )}

      {hasAddress && (
        <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-secondary/60 px-2.5 py-2">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
            <Camera className="size-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Endereço</p>
            <p className="text-sm font-semibold text-foreground text-pretty">
              {extra.deliveryAddress}
            </p>
          </div>
        </div>
      )}

      {hasNotes && (
        <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-accent px-2.5 py-2">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Info className="size-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Observações</p>
            <p className="text-sm font-semibold text-foreground text-pretty">
              {extra.notes}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
