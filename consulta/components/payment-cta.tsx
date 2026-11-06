'use client'

import { AlertTriangle, ChevronRight } from 'lucide-react'

export function PaymentCta({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-pulse-red flex w-full items-center gap-3 rounded-2xl bg-primary p-4 text-left shadow-lg shadow-primary/30 ring-2 ring-primary/40 transition-transform hover:animate-none hover:scale-[1.01]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-primary-foreground">
          Veículo com débito de documentação pendente
        </span>
        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary-foreground/15 px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
          Toque aqui para pagar e liberar o veículo
        </span>
      </span>
      <ChevronRight className="size-6 shrink-0 text-primary-foreground" aria-hidden="true" />
    </button>
  )
}
