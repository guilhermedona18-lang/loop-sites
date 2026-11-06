"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Pencil, Trash2, Users } from "lucide-react"
import { formatDate } from "@/lib/format"
import { StatusBadge } from "./status-badge"
import { createUser, updateUser, deleteUser, type UserInput } from "@/lib/actions/users"

type UserRow = UserInput & { id: number; createdAt: string | Date }

const ROLES = ["licitante", "vendedor", "leiloeiro"]
const STATUSES = ["ativo", "inativo", "pendente"]

const empty: UserInput = { name: "", email: "", phone: "", city: "", role: "licitante", status: "ativo" }

export function UsersManager({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<UserInput>(empty)

  function openCreate() {
    setEditId(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(u: UserRow) {
    setEditId(u.id)
    setForm({ name: u.name, email: u.email, phone: u.phone, city: u.city, role: u.role, status: u.status })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editId) await updateUser(editId, form)
    else await createUser(form)
    setSaving(false)
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este usuário?")) return
    await deleteUser(id)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">Gerencie licitantes, vendedores e leiloeiros.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo usuário
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
            {initialUsers.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div>{u.email || "—"}</div>
                  <div className="text-xs">{u.phone}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.city || "—"}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{u.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(u)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{editId ? "Editar usuário" : "Novo usuário"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nome">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="E-mail">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Telefone">
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
              </div>
              <Field label="Cidade">
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Perfil">
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize text-foreground"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize text-foreground"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
