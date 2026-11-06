"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { LoopProvider, useLoop } from "./store"
import { TopHeader } from "./top-header"
import { BottomNav } from "./bottom-nav"
import { MenuDrawer } from "./menu-drawer"
import { CatalogLoader } from "./catalog-loader"
import { ReviewToasts } from "./review-toasts"
import { HomeView } from "./views/home-view"
import { SearchView } from "./views/search-view"
import { AuctionsView } from "./views/auctions-view"
import { FavoritesView } from "./views/favorites-view"
import { AccountView } from "./views/account-view"
import { SiteFooter } from "./site-footer"
import type { Vehicle } from "@/lib/loop-data"

function Shell() {
  const { tab } = useLoop()
  const showHeader = tab !== "conta"

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-sm">
      {showHeader && <TopHeader />}

      <main className="flex-1 pb-28">
        {tab === "inicio" && <HomeView />}
        {tab === "buscar" && <SearchView />}
        {tab === "leiloes" && <AuctionsView />}
        {tab === "favoritos" && <FavoritesView />}
        {tab === "conta" && <AccountView />}

        {tab !== "conta" && <SiteFooter />}
      </main>

      <button
        type="button"
        aria-label="Abrir atendimento"
        className="fixed bottom-24 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95"
      >
        <MessageCircle className="size-6" />
      </button>

      <ReviewToasts />

      <MenuDrawer />
      <BottomNav />
    </div>
  )
}

export function LoopApp({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <CatalogLoader onDone={() => setLoading(false)} />
  }

  return (
    <LoopProvider vehicles={vehicles}>
      <Shell />
    </LoopProvider>
  )
}
