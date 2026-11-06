"use client"

import Image from "next/image"
import {
  ShieldCheck,
  FileText,
  DollarSign,
  Truck,
  BadgeCheck,
  ClipboardCheck,
} from "lucide-react"
import type { Vehicle } from "@/lib/loop-data"

function brl(value: number, withCents = false) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  })
}

export function FinancialSummary({ vehicle }: { vehicle: Vehicle }) {
  const total = vehicle.price

  const included = [
    {
      icon: FileText,
      title: "Documentação",
      desc: "Custos de documentação informados oficialmente pela leiloeira.",
    },
    {
      icon: Truck,
      title: "Transporte incluso",
      desc: "Inclui transporte padrão até o destino informado na consulta.",
    },
  ]

  const badges = [
    { icon: BadgeCheck, title: "Veículo verificado" },
    { icon: ClipboardCheck, title: "Custos informados" },
  ]

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#1a0409] via-[#2a0912] to-[#490f1d] p-5 text-white">
      <h2 className="font-heading text-2xl font-extrabold text-balance">
        Resumo Financeiro do Veículo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Confira abaixo o valor total deste lote considerando custos oficiais,
        documentação e transparência da leiloeira.
      </p>

      <div className="mt-4 rounded-2xl bg-card p-4 text-foreground">
        {/* logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/loop-logo.png"
            alt="Loop Leilões"
            width={132}
            height={40}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* selos */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-bold text-foreground">
              Lote verificado
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
            <FileText className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-bold leading-tight text-foreground">
              Documentação conferida
            </span>
          </div>
        </div>

        {/* valor total */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent">
              <DollarSign className="size-6 text-primary" />
            </span>
            <span className="font-heading text-lg font-extrabold text-foreground">
              Valor total do veículo
            </span>
          </div>
          <p className="mt-3 font-heading text-5xl font-extrabold tracking-tight text-foreground">
            {brl(total)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Valor final estimado da consulta com base nas informações oficiais
            divulgadas pela leiloeira.
          </p>
        </div>

        {/* valor do lote */}
        <div className="mt-3 rounded-2xl bg-secondary p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Valor do lote
          </p>
          <p className="mt-0.5 font-heading text-xl font-extrabold text-foreground">
            {brl(total)}
          </p>
        </div>

        {/* itens inclusos */}
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-heading text-sm font-extrabold text-foreground">
            Itens inclusos e valores à parte
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {included.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <item.icon className="size-5 text-primary" />
              <p className="mt-2 font-heading text-sm font-bold text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-3"
            >
              <b.icon className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {b.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
