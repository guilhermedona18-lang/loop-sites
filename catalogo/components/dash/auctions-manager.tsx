"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Pencil, Trash2, CalendarClock } from "lucide-react"
import { formatDateTime } from "@/lib/format"
import { StatusBadge } from "./status-badge"
import { createAuction, updateAuction, deleteAuction, type AuctionInput } from "@/lib/actions/auctions"

type AuctionRow = {
  id: number
  title: string
  description: string
  status: string
  startsAt: string | Date | null
  endsAt: string | Date | null
}

const STATUSES = ["agendado", "ao-vivo", "encerrado", "cancelado"]

const empty: AuctionInput = { title: "", description: "", status: "agendado", startsAt: null, endsAt: null }

function toInput(d: string | Date | null) {
  if (!d) return ""
  const date = new Date(d)
  const off = date.getTimezoneOffset()
  return new Date(date.getTime() - off * 60000).toISOString().slice(0, 16)
}

export function AuctionsManager({ initialAuctions }: { initialAuctions: AuctionRow[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<AuctionInput>(empty)

  function openCreate() {
    setEditId(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(a: AuctionRow) {
    setEditId(a.id)
    setForm({
      title: a.title,
      description: a.description,
      status: a.status,
      startsAt: toInput(a.startsAt),
      endsAt: toInput(a.endsAt),
    })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editId) await updateAuction(editId, form)
    else await createAuction(form)
    setSaving(false)
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este leilão?")) return
    await deleteAuction(id)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leilões</h1>
          <p className="text-sm text-muted-foreground">Crie, edite e controle os leilões.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo leilão
        </button>
      </div>

      {initialAuctions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
          <CalendarClock className="mx-auto mb-2 h-8 w-8 opacity-40" />
          Nenhum leilão cadastrado ainda.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialAuctions.map((a) => (
            <div key={a.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <StatusBadge status={a.status} />
              </div>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{a.description || "Sem descrição."}</p>
              <dl className="mb-4 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Início</dt>
                  <dd className="text-foreground">{a.startsAt ? formatDateTime(a.startsAt) : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Término</dt>
                  <dd className="text-foreground">{a.endsAt ? formatDateTime(a.endsAt) : "—"}</dd>
                </div>
              </dl>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{editId ? "Editar leilão" : "Novo leilão"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Início</label>
                  <input
                    type="datetime-local"
                    value={form.startsAt ?? ""}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Término</label>
                  <input
                    type="datetime-local"
                    value={form.endsAt ?? ""}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
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
