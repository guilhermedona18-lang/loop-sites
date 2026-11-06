"use client"

import { Heart } from "lucide-react"
import { useLoop } from "../store"
import { VehicleCard } from "../vehicle-card"

export function FavoritesView() {
  const { favorites, setTab, vehicles } = useLoop()
  const list = vehicles.filter((v) => favorites.includes(v.id))

  return (
    <div className="px-4 pt-4">
      <h1 className="font-heading text-2xl font-extrabold text-foreground">
        Favoritos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Lotes que você salvou para acompanhar.
      </p>

      {list.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent">
            <Heart className="size-8 text-primary" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold text-foreground">
            Nenhum favorito ainda
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Toque no coração de um veículo para salvá-lo aqui e acompanhar os
            lances.
          </p>
          <button
            type="button"
            onClick={() => setTab("buscar")}
            className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition active:scale-95"
          >
            Explorar veículos
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {list.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  )
}
