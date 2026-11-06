"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useLoop } from "../store"

export function HeroBanner() {
  const { setTab } = useLoop()

  return (
    <section className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-card to-accent">
        <Image
          src="/hero-arrematante.png"
          alt="Arrematante satisfeito ao lado de um carro"
          width={720}
          height={540}
          className="pointer-events-none absolute -right-4 bottom-0 h-auto w-[78%] max-w-[360px] select-none object-contain object-right-bottom"
          priority
        />

        <div className="relative z-10 max-w-[60%] p-5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
            Aviso importante
          </span>
          <h1 className="mt-1 font-heading text-3xl font-extrabold uppercase leading-[1.05] text-primary text-balance">
            Atenção arrematante!
          </h1>
          <p className="mt-2 text-sm font-semibold text-foreground">
            Temos novidade no fluxo de pagamento.
          </p>

          <div className="mt-3 rounded-2xl bg-card/85 p-3 text-xs leading-relaxed text-muted-foreground shadow-sm backdrop-blur">
            Atualizamos o processo para{" "}
            <span className="font-semibold text-foreground">
              facilitar sua rotina
            </span>{" "}
            e garantir ainda mais{" "}
            <span className="font-semibold text-foreground">segurança</span>.
          </div>

          <button
            type="button"
            onClick={() => setTab("leiloes")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95"
          >
            Saiba mais
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
