'use client'

import { TriangleAlert } from 'lucide-react'
import { LiveMap, TrackingAddresses } from '@/components/live-map'
import type { TrackingInfo, Vehicle } from '@/lib/vehicles'

export function LiveTrackingSection({
  tracking,
  vehicle,
}: {
  tracking: TrackingInfo
  vehicle: Vehicle
}) {
  const vehicleImage = '/images/strada-tracking.png'

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Cabeçalho ao vivo */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            {!tracking.locked && !tracking.driverProblem && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            )}
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <h2 className="text-sm font-bold text-foreground">
            Simulação de trajeto
          </h2>
        </div>
        <span className="rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-primary-foreground">
          Simulação
        </span>
      </div>

      {/* Imagem do veículo */}
      {vehicleImage && (
        <div className="border-b border-border bg-white">
          <img
            src={vehicleImage || '/placeholder.svg'}
            alt={vehicle.fullTitle || vehicle.brandModel}
            className="mx-auto h-44 w-full max-w-md object-contain"
          />
        </div>
      )}

      {/* Mapa */}
      <div className="bg-white">
        <LiveMap
          locked={tracking.locked}
          problem={tracking.driverProblem}
          origin={tracking.originAddress}
          destination={tracking.destinationAddress}
        />
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Aviso de problema */}
        {tracking.driverProblem && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold text-amber-700">
                Ocorrência informada pelo motorista
              </p>
              <p className="text-sm leading-relaxed text-pretty text-amber-700/90">
                {tracking.driverStatusMessage ||
                  'O motorista relatou um imprevisto. A entrega pode atrasar.'}
              </p>
            </div>
          </div>
        )}

        {/* Endereços */}
        <TrackingAddresses
          origin={tracking.originAddress}
          destination={tracking.destinationAddress}
        />
      </div>
    </section>
  )
}
