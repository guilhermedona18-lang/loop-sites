"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Gavel,
  Car,
  HandCoins,
  Users,
  Headset,
  BarChart3,
  Settings,
  Calculator,
  Plug,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"

const nav = [
  { href: "/dash", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dash/leiloes", label: "Leilões", icon: Gavel },
  { href: "/dash/lotes", label: "Lotes / Veículos", icon: Car },
  { href: "/dash/lances", label: "Lances", icon: HandCoins },
  { href: "/dash/contratos", label: "Contratos salvos", icon: Calculator },
  { href: "/dash/simulacao", label: "Simular financiamento", icon: Calculator },
  { href: "/dash/usuarios", label: "Usuários", icon: Users },
  { href: "/dash/leiloeiro", label: "Leiloeiro", icon: Headset },
  { href: "/dash/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dash/integracoes", label: "Integrações", icon: Plug },
  { href: "/dash/configuracoes", label: "Configurações", icon: Settings },
]

export function DashShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon
        const active =
          item.href === "/dash"
            ? pathname === "/dash"
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-muted">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card p-4 lg:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Gavel className="size-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-extrabold leading-tight text-foreground">
              Loop Leilões
            </p>
            <p className="text-[11px] text-muted-foreground">Painel admin</p>
          </div>
        </div>
        <div className="mt-4 flex-1">
          <NavLinks />
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-5" />
            Sair
          </button>
        </form>
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Gavel className="size-4" />
          </span>
          <span className="font-heading text-sm font-extrabold text-foreground">
            Loop Leilões
          </span>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-card p-4">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="font-heading text-sm font-extrabold text-foreground">
                Menu
              </span>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-border"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-3">
              <NavLinks />
            </div>
            <form action={logout} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-5" />
                Sair
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">{children}</div>
      </div>
    </div>
  )
}
