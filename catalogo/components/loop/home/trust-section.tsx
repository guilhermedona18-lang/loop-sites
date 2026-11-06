"use client"

import { useState } from "react"
import {
  ClipboardCheck,
  Gavel,
  Headphones,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { trustBadges } from "@/lib/loop-data"

const whyCards = [
  { title: "Compra segura", icon: ShieldCheck },
  { title: "Veículos verificados", icon: ClipboardCheck },
  { title: "Suporte no leilão", icon: Gavel },
  { title: "Atendimento humano", icon: Headphones },
]

const details = [
  {
    icon: ShieldCheck,
    title: "Base DETRAN",
    desc: "Conferência de dados com referência documental oficial para reforçar confiança no arremate.",
  },
  {
    icon: Lock,
    title: "Proteção LGPD",
    desc: "Tratamento responsável das informações do comprador com padrão de privacidade e controle.",
  },
  {
    icon: ClipboardCheck,
    title: "Transparência total",
    desc: "Etapas, taxas e orientações exibidas de forma clara para decisão segura em cada lote.",
  },
  {
    icon: Headphones,
    title: "Garantia de suporte",
    desc: "Canal oficial ativo para acompanhar você do lance até a finalização da compra.",
  },
]

export function TrustSection() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <section className="px-4 pt-6">
      <div className="space-y-5 rounded-3xl bg-ink p-5 text-ink-foreground">
        {/* Priority strip */}
        <div>
          <h2 className="text-center font-heading text-lg font-bold">
            Sua segurança e nossa prioridade
          </h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {trustBadges.map((b) => (
              <div key={b.key} className="flex flex-col items-center text-center">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck className="size-4 text-primary" />
                </span>
                <span className="mt-2 text-[10px] font-semibold leading-tight">
                  {b.title}
                </span>
                <span className="mt-0.5 text-[9px] leading-tight text-ink-foreground/60">
                  {b.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why buy title */}
        <h3 className="pt-2 text-center font-heading text-xl font-bold">
          Por que comprar conosco?
        </h3>

        {/* Why cards */}
        <div className="grid grid-cols-2 gap-3">
          {whyCards.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card px-3 py-4 text-center"
              >
                <Icon className="size-6 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {c.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Detail block */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
          {details.map((d, i) => {
            const Icon = d.icon
            return (
              <div key={d.title}>
                <div className="flex gap-3 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-5 text-ink-foreground" />
                  </span>
                  <div>
                    <h4 className="font-heading text-lg font-bold leading-tight">
                      {d.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-foreground/70">
                      {d.desc}
                    </p>
                  </div>
                </div>
                {i < details.length - 1 && (
                  <div className="mx-3 h-px bg-white/10" />
                )}
              </div>
            )
          })}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary">
              <Lock className="size-4 text-primary-foreground" />
            </span>
            <div>
              <p className="text-sm font-bold">Receba oportunidades exclusivas</p>
              <p className="text-xs text-ink-foreground/60">
                Ofertas selecionadas no seu e-mail.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-3 text-sm font-medium text-ink-foreground">
              <CheckCircle2 className="size-5 text-primary" />
              Pronto! Você receberá nossas ofertas.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes("@")) setSent(true)
              }}
              className="mt-3 flex overflow-hidden rounded-xl bg-card"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="shrink-0 bg-primary px-5 text-sm font-bold text-primary-foreground transition active:scale-95"
              >
                Receber
              </button>
            </form>
          )}
          <p className="mt-2 text-[11px] text-ink-foreground/50">
            Seus dados estão seguros conosco.
          </p>
        </div>
      </div>
    </section>
  )
}
