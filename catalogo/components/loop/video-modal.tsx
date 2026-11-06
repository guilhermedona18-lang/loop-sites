"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, Video, Users, MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/message/DGZ2W2OPP6HIE1"

const reps = [
  { name: "Thiago Portes", role: "Leiloeiro Oficial", photo: "/loop/thiago-portes.png" },
]

export function VideoModal({
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

  const waUrl = WHATSAPP_URL

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Vídeo do veículo"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 animate-in fade-in duration-200"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition active:scale-90"
        >
          <X className="size-5" />
        </button>

        <div className="max-h-[88vh] overflow-y-auto px-6 pb-6 pt-8">
          <div className="mx-auto -mb-2 flex size-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
            <Video className="size-7 text-primary-foreground" />
          </div>

          <h2 className="mt-4 text-center font-heading text-2xl font-extrabold leading-tight text-foreground text-balance">
            Vídeo ainda não disponível neste momento
          </h2>

          <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
            Este lote ainda não possui vídeo público. Solicite agora o vídeo oficial direto com
            o representante autorizado da Loop.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary">
              <Users className="size-4" />
            </span>
            <p className="font-heading text-sm font-bold text-foreground">Revendedores oficiais</p>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reps.map((r) => (
              <div
                key={r.name}
                className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-3"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
                  <Image src={r.photo || "/placeholder.svg"} alt={r.name} fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.role}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    Online agora
                  </span>
                </div>
              </div>
            ))}
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-4 font-heading text-base font-extrabold text-white shadow-lg shadow-emerald-500/30 transition active:scale-95"
          >
            <MessageCircle className="size-5" />
            Solicitar vídeo deste veículo
          </a>
        </div>
      </div>
    </div>
  )
}
