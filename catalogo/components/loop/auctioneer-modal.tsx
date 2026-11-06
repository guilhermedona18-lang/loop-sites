"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, MessageCircle, Phone, Clock, CheckCircle2 } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/message/DGZ2W2OPP6HIE1"

const benefits = [
  "Dê seu lance verbalmente",
  "Tire dúvidas sobre o veículo",
  "Peça mais tempo ou informações",
]

export function AuctioneerModal({
  open,
  onClose,
  vehicleName,
}: {
  open: boolean
  onClose: () => void
  vehicleName?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Falar com o leiloeiro"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 animate-in fade-in duration-200"
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-card p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition active:scale-90"
        >
          <X className="size-5" />
        </button>

        <p className="text-center font-heading text-xl font-extrabold leading-tight text-foreground text-balance">
          Quer aumentar suas chances de arrematar?
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-primary">
          <MessageCircle className="size-4" />
          Fale agora com o Leiloeiro
        </p>

        <div className="mt-5 flex flex-col items-center">
          <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-primary/20">
            <Image
              src="/loop/thiago-portes.png"
              alt="Thiago Portes, leiloeiro da Loop Leilões"
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
          <p className="mt-3 font-heading text-lg font-bold text-foreground">
            Thiago Portes
          </p>
          <p className="text-xs text-muted-foreground">Leiloeiro Oficial</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Ele está online neste momento
          </span>
        </div>

        <ul className="mt-5 space-y-2">
          {benefits.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2.5 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground"
            >
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
              {b}
            </li>
          ))}
        </ul>

        {vehicleName && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Sobre: {vehicleName}
          </p>
        )}

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-heading text-base font-extrabold text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95"
        >
          <Phone className="size-5" />
          Falar agora com o Leiloeiro
        </a>
      </div>
    </div>
  )
}
