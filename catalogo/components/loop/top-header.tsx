"use client"

import Image from "next/image"
import { Calculator, Menu, User } from "lucide-react"
import { useLoop } from "./store"

export function TopHeader() {
  const { setMenuOpen, setTab } = useLoop()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setTab("inicio")}
          className="flex items-center gap-2"
          aria-label="Ir para o início"
        >
          <Image
            src="/loop-logo-mark.png"
            alt="Loop"
            width={240}
            height={160}
            className="h-12 w-auto"
            priority
          />
          <span className="rounded-md bg-primary px-2 py-0.5 font-heading text-xs font-extrabold uppercase tracking-wide text-primary-foreground">
            Leilões
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Simulação"
            className="flex size-10 items-center justify-center rounded-full bg-accent text-primary transition active:scale-95"
          >
            <Calculator className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setTab("conta")}
            aria-label="Minha conta"
            className="flex size-10 items-center justify-center rounded-full bg-ink text-ink-foreground transition active:scale-95"
          >
            <User className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex size-10 items-center justify-center rounded-full text-foreground transition active:scale-95"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
