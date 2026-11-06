"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop } from "../store"
import { VehicleCard } from "../vehicle-card"
import { LotesStrip } from "../lotes-strip"

const filters = [
  { key: "todos", label: "Todos" },
  { key: "carros", label: "Carros" },
  { key: "motos", label: "Motos" },
  { key: "pesados", label: "Pesados" },
]

export function SearchView() {
  const { vehicles, category, setCategory } = useLoop()
  const active = category
  const setActive = setCategory
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    return vehicles.filter((v) => {
      const matchCat = active === "todos" || v.category === active
      const matchQuery =
        query.trim() === "" ||
        `${v.name} ${v.brand}`.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [active, query, vehicles])

  return (
    <div className="px-4 pt-4">
      <h1 className="font-heading text-2xl font-extrabold text-foreground">
        Buscar veículos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Encontre o lote ideal entre os leilões abertos.
      </p>

      <LotesStrip vehicles={results} />

      <div className="mt-4 flex items-center gap-2">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marca ou modelo"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          type="button"
          aria-label="Filtros"
          className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition active:scale-95"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key as typeof active)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
              active === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-medium text-muted-foreground">
        {results.length} resultado{results.length !== 1 && "s"}
      </p>

      <div className="mt-3 space-y-4">
        {results.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
        {results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum veículo encontrado para sua busca.
          </div>
        )}
      </div>
    </div>
  )
}
