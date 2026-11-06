import { redirect } from "next/navigation"
import {
  Car,
  CircleCheck,
  CircleSlash,
  HandCoins,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react"
import { isAuthenticated } from "@/lib/auth-admin"
import { getDashboardStats } from "@/lib/actions/settings"
import { formatBRL } from "@/lib/format"
import { StatusBadge } from "@/components/dash/status-badge"

export const dynamic = "force-dynamic"

const categoryLabels: Record<string, string> = {
  carros: "Carros",
  motos: "Motos",
  pesados: "Pesados",
}

export default async function DashboardPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const stats = await getDashboardStats()

  const cards = [
    {
      label: "Veículos ativos",
      value: stats.activeVehicles,
      icon: CircleCheck,
      hint: `${stats.totalVehicles} no total`,
    },
    {
      label: "Inativos",
      value: stats.inactiveVehicles,
      icon: CircleSlash,
      hint: "Fora da vitrine",
    },
    {
      label: "Lances novos",
      value: stats.newBids,
      icon: HandCoins,
      hint: `${stats.totalBids} no total`,
    },
    {
      label: "Usuários",
      value: stats.totalUsers,
      icon: Users,
      hint: "Licitantes e vendedores",
    },
  ]

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral dos leilões e do estoque em tempo real.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </span>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-foreground">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
            </div>
          )
        })}
      </div>

      {/* Value cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Valor em estoque (ativo)
            </span>
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-foreground">
            {formatBRL(stats.inventoryValue)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Total arrematado
            </span>
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-foreground">
            {formatBRL(stats.soldValue)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Por categoria */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Car className="size-5 text-primary" />
            <h2 className="font-heading text-base font-bold text-foreground">
              Estoque por categoria
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {stats.byCategory.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem veículos ativos.</p>
            )}
            {stats.byCategory.map((c) => {
              const pct = stats.activeVehicles
                ? Math.round((c.total / stats.activeVehicles) * 100)
                : 0
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {categoryLabels[c.category] ?? c.category}
                    </span>
                    <span className="text-muted-foreground">
                      {c.total} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Lances recentes */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <HandCoins className="size-5 text-primary" />
            <h2 className="font-heading text-base font-bold text-foreground">
              Lances recentes
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentBids.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum lance registrado ainda.
              </p>
            )}
            {stats.recentBids.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {b.vehicleName || "Veículo"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.bidderName || "Licitante"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {formatBRL(b.amount)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
