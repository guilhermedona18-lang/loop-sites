"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { Radio, Trophy, MessageCircle, Gavel } from "lucide-react"
import { formatBRL, formatDateTime } from "@/lib/format"
import { updateBidStatus, type BidRow } from "@/lib/actions/bids"

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<BidRow[]>)

type VehicleLite = { id: string; name: string; price: number; image: string; status: string }

export function AuctioneerView({
  initialBids,
  vehicles,
}: {
  initialBids: BidRow[]
  vehicles: VehicleLite[]
}) {
  const { data: bids = initialBids, mutate } = useSWR<BidRow[]>("/api/dash/bids", fetcher, {
    fallbackData: initialBids,
    refreshInterval: 4000,
  })

  const [selectedId, setSelectedId] = useState<string>(vehicles[0]?.id ?? "")
  const selected = vehicles.find((v) => v.id === selectedId)

  const lotBids = useMemo(
    () => bids.filter((b) => b.vehicleId === selectedId).sort((a, b) => b.amount - a.amount),
    [bids, selectedId],
  )
  const topBid = lotBids[0]

  async function declareWinner(id: number) {
    await updateBidStatus(id, "vencedor")
    mutate()
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Radio className="h-5 w-5 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mesa do Leiloeiro</h1>
          <p className="text-sm text-muted-foreground">Acompanhe os lances ao vivo e declare o vencedor.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Lista de lotes */}
        <div className="space-y-2">
          <h2 className="px-1 text-xs font-medium uppercase text-muted-foreground">Lotes</h2>
          <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {vehicles.map((v) => {
              const count = bids.filter((b) => b.vehicleId === v.id).length
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                    selectedId === v.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {v.image && (
                      <Image src={v.image || "/placeholder.svg"} alt={v.name} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{formatBRL(v.price)}</div>
                  </div>
                  {count > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detalhe do lote */}
        <div className="space-y-4">
          {selected && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">Lance inicial: {formatBRL(selected.price)}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase text-muted-foreground">Maior lance</div>
                  <div className="text-2xl font-bold text-primary">{topBid ? formatBRL(topBid.amount) : "—"}</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
              Lances recebidos ({lotBids.length})
            </div>
            <div className="divide-y divide-border">
              {lotBids.length === 0 && (
                <div className="px-5 py-10 text-center text-muted-foreground">
                  <Gavel className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  Nenhum lance para este lote.
                </div>
              )}
              {lotBids.map((b, i) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{b.bidderName || "Licitante"}</div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(b.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatBRL(b.amount)}</div>
                    {b.status === "vencedor" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Trophy className="h-3 w-3" /> Vencedor
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {b.bidderPhone && (
                      <a
                        href={`https://wa.me/55${b.bidderPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Falar com o licitante"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                    {b.status !== "vencedor" && (
                      <button
                        onClick={() => declareWinner(b.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        <Trophy className="h-3.5 w-3.5" /> Vencedor
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
