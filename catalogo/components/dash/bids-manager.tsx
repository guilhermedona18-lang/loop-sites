"use client"

import { useState } from "react"
import useSWR, { mutate as globalMutate } from "swr"
import { Plus, Loader2, Trash2, Gavel } from "lucide-react"
import { formatBRL, formatDateTime } from "@/lib/format"
import { StatusBadge } from "./status-badge"
import { createBid, updateBidStatus, deleteBid, type BidRow } from "@/lib/actions/bids"
import type { Vehicle } from "@/lib/loop-data"

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<BidRow[]>)

const STATUS_OPTIONS = ["novo", "aceito", "recusado", "vencedor"]

export function BidsManager({
  initialBids,
  vehicles,
}: {
  initialBids: BidRow[]
  vehicles: Pick<Vehicle, "id" | "name">[]
}) {
  const { data: bids = initialBids, mutate } = useSWR<BidRow[]>("/api/dash/bids", fetcher, {
    fallbackData: initialBids,
    refreshInterval: 5000,
  })

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id ?? "",
    bidderName: "",
    bidderPhone: "",
    amount: "",
  })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.set("vehicleId", form.vehicleId)
    fd.set("vehicleName", vehicles.find((v) => v.id === form.vehicleId)?.name ?? "")
    fd.set("bidderName", form.bidderName)
    fd.set("bidderPhone", form.bidderPhone)
    fd.set("amount", form.amount)
    await createBid(fd)
    setSaving(false)
    setOpen(false)
    setForm({ vehicleId: vehicles[0]?.id ?? "", bidderName: "", bidderPhone: "", amount: "" })
    mutate()
    globalMutate("/api/dash/bids")
  }

  async function handleStatus(id: number, status: string) {
    await updateBidStatus(id, status)
    mutate()
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este lance?")) return
    await deleteBid(id)
    mutate()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lances</h1>
          <p className="text-sm text-muted-foreground">Acompanhe os lances em tempo real e o histórico.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Registrar lance
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Lote</th>
              <th className="px-4 py-3 font-medium">Licitante</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Quando</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bids.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  <Gavel className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  Nenhum lance registrado ainda.
                </td>
              </tr>
            )}
            {bids.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{b.vehicleName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="text-foreground">{b.bidderName || "—"}</div>
                  <div className="text-xs">{b.bidderPhone}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">{formatBRL(b.amount)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateTime(b.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatus(b.id, e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs capitalize text-foreground"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Excluir lance"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Registrar lance</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Lote</label>
                <select
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do licitante</label>
                <input
                  value={form.bidderName}
                  onChange={(e) => setForm({ ...form, bidderName: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Telefone</label>
                <input
                  value={form.bidderPhone}
                  onChange={(e) => setForm({ ...form, bidderPhone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor do lance (R$)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  required
                  min={0}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
