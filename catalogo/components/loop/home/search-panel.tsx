"use client"

import { useState } from "react"
import {
  ArrowRight,
  Bike,
  Calendar,
  Car,
  ChevronDown,
  Info,
  LayoutGrid,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop } from "../store"

const tabs = [
  { key: "todos", label: "Todos", icon: LayoutGrid },
  { key: "carros", label: "Carros", icon: Car },
  { key: "motos", label: "Motos", icon: Bike },
  { key: "pesados", label: "Pesados", icon: Truck },
]

export function SearchPanel() {
  const { setTab, category, setCategory } = useLoop()
  const active = category
  const [includeStock, setIncludeStock] = useState(true)
  const [query, setQuery] = useState("")

  return (
    <section className="mt-2">
      {/* Category tabs */}
      <div className="flex items-stretch border-b border-border bg-card px-2">
        {tabs.map((tab) => {
          const isActive = active === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCategory(tab.key as typeof category)}
              className="relative flex flex-1 flex-col items-center gap-1 py-3"
            >
              <Icon
                className={cn(
                  "size-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-semibold",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      <div className="space-y-3 bg-card px-4 pb-5 pt-4">
        {/* Event select */}
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Calendar className="size-5 shrink-0 text-muted-foreground" />
          <select
            defaultValue=""
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
            aria-label="Selecionar evento"
          >
            <option value="" disabled>
              Selecionar evento
            </option>
            <option value="1">Leilão Nacional — 28/06</option>
            <option value="2">Leilão Sudeste — 02/07</option>
            <option value="3">Leilão Pesados — 05/07</option>
          </select>
          <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
        </label>

        {/* Search input */}
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite a marca ou modelo"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>

        {/* Ver veículos */}
        <button
          type="button"
          onClick={() => setTab("buscar")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99]"
        >
          Ver veículos (2.571)
          <ArrowRight className="size-5" />
        </button>

        {/* Stock toggle */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Estoque não loteado
              </span>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={includeStock}
              aria-label="Incluir estoque não loteado"
              onClick={() => setIncludeStock((v) => !v)}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition",
                includeStock ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-5 rounded-full bg-card shadow transition-all",
                  includeStock ? "left-6" : "left-1",
                )}
              />
            </button>
          </div>
          <p className="mt-3 rounded-xl bg-accent px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            Deseja ver também os{" "}
            <span className="font-semibold text-foreground">
              2.458 veículos
            </span>{" "}
            disponíveis em estoque não loteado.
          </p>
        </div>
      </div>
    </section>
  )
}
