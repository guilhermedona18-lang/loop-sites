"use client"

import { Gavel, Heart, Home, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoop, type TabKey } from "./store"

const items: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "inicio", label: "Início", icon: Home },
  { key: "buscar", label: "Buscar", icon: Search },
  { key: "leiloes", label: "Leilões", icon: Gavel },
  { key: "favoritos", label: "Favoritos", icon: Heart },
  { key: "conta", label: "Conta", icon: User },
]

export function BottomNav() {
  const { tab, setTab } = useLoop()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card">
      <ul className="relative flex items-end justify-between px-3 pb-3 pt-2">
        {items.map((item) => {
          const active = tab === item.key
          const isCenter = item.key === "leiloes"
          const Icon = item.icon

          if (isCenter) {
            return (
              <li key={item.key} className="flex flex-1 justify-center">
                <button
                  type="button"
                  onClick={() => setTab(item.key)}
                  className="flex flex-col items-center gap-1"
                  aria-label={item.label}
                >
                  <span className="-mt-7 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-card transition active:scale-95">
                    <Icon className="size-6" />
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            )
          }

          return (
            <li key={item.key} className="flex flex-1 justify-center">
              <button
                type="button"
                onClick={() => setTab(item.key)}
                className="flex flex-col items-center gap-1 transition active:scale-95"
                aria-label={item.label}
              >
                <Icon
                  className={cn(
                    "size-6",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
