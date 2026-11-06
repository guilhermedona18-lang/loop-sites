"use client"

import { TrendingUp, Package, Gavel, Trophy } from "lucide-react"
import { formatBRL, formatDateTime } from "@/lib/format"
import { StatusBadge } from "./status-badge"
import type { DashboardStats } from "@/lib/actions/settings"
import type { BidRow } from "@/lib/actions/bids"

const CATEGORY_LABELS: Record<string, string> = {
  carros: "Carros",
  motos: "Motos",
  pesados: "Pesados",
}

export function ReportsView({ stats, bids }: { stats: DashboardStats; bids: BidRow[] }) {
  const winners = bids.filter((b) => b.status === "vencedor")
  const totalBidVolume = bids.reduce((acc, b) => acc + b.amount, 0)
  const maxCat = Math.max(1, ...stats.byCategory.map((c) => c.total))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Resumo de vendas e desempenho dos leilões.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Trophy} label="Total vendido" value={formatBRL(stats.soldValue)} accent />
        <Metric icon={Package} label="Valor em estoque" value={formatBRL(stats.inventoryValue)} />
        <Metric icon={Gavel} label="Volume de lances" value={formatBRL(totalBidVolume)} />
        <Metric icon={TrendingUp} label="Lotes arrematados" value={String(winners.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Por categoria */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Lotes ativos por categoria</h2>
          <div className="space-y-3">
            {stats.byCategory.length === 0 && <p className="text-sm text-muted-foreground">Sem dados.</p>}
            {stats.byCategory.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{CATEGORY_LABELS[c.category] ?? c.category}</span>
                  <span className="text-muted-foreground">{c.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.total / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrematações */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Arrematações</h2>
          <div className="space-y-2">
            {winners.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma arrematação registrada.</p>}
            {winners.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{b.vehicleName}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.bidderName || "Licitante"} • {formatDateTime(b.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatBRL(b.amount)}</div>
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

function Metric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : ""}`} />
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  )
}
