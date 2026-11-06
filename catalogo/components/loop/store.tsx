"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Vehicle } from "@/lib/loop-data"

export type TabKey = "inicio" | "buscar" | "leiloes" | "favoritos" | "conta"
export type CategoryKey = "todos" | "carros" | "motos" | "pesados"

type LoopState = {
  tab: TabKey
  setTab: (tab: TabKey) => void
  category: CategoryKey
  setCategory: (category: CategoryKey) => void
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  user: string | null
  login: (email: string) => void
  logout: () => void
  vehicles: Vehicle[]
}

const LoopContext = createContext<LoopState | null>(null)

export function LoopProvider({
  children,
  vehicles = [],
}: {
  children: ReactNode
  vehicles?: Vehicle[]
}) {
  const [tab, setTab] = useState<TabKey>("inicio")
  const [category, setCategory] = useState<CategoryKey>("todos")
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [user, setUser] = useState<string | null>(null)

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  const value = useMemo<LoopState>(
    () => ({
      tab,
      setTab,
      category,
      setCategory,
      menuOpen,
      setMenuOpen,
      favorites,
      toggleFavorite,
      isFavorite,
      user,
      login: (email: string) => setUser(email),
      logout: () => setUser(null),
      vehicles,
    }),
    [tab, category, menuOpen, favorites, toggleFavorite, isFavorite, user, vehicles],
  )

  return <LoopContext.Provider value={value}>{children}</LoopContext.Provider>
}

export function useLoop() {
  const ctx = useContext(LoopContext)
  if (!ctx) throw new Error("useLoop must be used within LoopProvider")
  return ctx
}
