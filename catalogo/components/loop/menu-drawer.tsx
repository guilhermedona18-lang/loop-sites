"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop, type TabKey } from "./store"

type MenuItem = { label: string; tab?: TabKey }

const menuItems: MenuItem[] = [
  { label: "Início", tab: "inicio" },
  { label: "Buscar veículos", tab: "buscar" },
  { label: "Leilões", tab: "leiloes" },
  { label: "Segurança" },
  { label: "Consulta e simulação" },
  { label: "Minha conta", tab: "conta" },
]

export function MenuDrawer() {
  const { menuOpen, setMenuOpen, setTab } = useLoop()

  function handleClick(item: MenuItem) {
    if (item.tab) setTab(item.tab)
    setMenuOpen(false)
  }

  return (
    <>
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-300",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs bg-card shadow-xl transition-transform duration-300 ease-out",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Menu
          </h2>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="rounded-xl bg-secondary px-5 py-4 text-left text-[15px] font-semibold text-foreground transition hover:bg-accent hover:text-primary active:scale-[0.99]"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
