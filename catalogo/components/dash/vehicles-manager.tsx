"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  Car,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"
import { StatusBadge } from "./status-badge"
import { ImageUploader } from "./image-uploader"
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setVehicleActive,
  type VehicleInput,
} from "@/lib/actions/vehicles"
import type { Vehicle } from "@/lib/loop-data"

type AdminVehicle = Vehicle & { active: boolean; sortOrder: number }

const categories = [
  { value: "carros", label: "Carros" },
  { value: "motos", label: "Motos" },
  { value: "pesados", label: "Pesados" },
]
const statuses = [
  { value: "aberto", label: "Aberto" },
  { value: "novo", label: "Novo" },
  { value: "encerrando", label: "Encerrando" },
]

const empty: VehicleInput = {
  name: "",
  brand: "",
  category: "carros",
  version: "",
  year: "",
  km: "",
  transmission: "",
  fuel: "",
  color: "",
  engine: "",
  doors: "",
  steering: "",
  traction: "",
  bodywork: "",
  condition: "",
  origin: "",
  ipva: "",
  sinistro: "",
  chassi: "",
  renavam: "",
  placa: "",
  price: 0,
  status: "aberto",
  note: "",
  images: [],
  active: true,
}

export function VehiclesManager({
  initialVehicles,
}: {
  initialVehicles: AdminVehicle[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VehicleInput>(empty)
  const [pending, startTransition] = useTransition()

  const filtered = initialVehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.version ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  function openCreate() {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(v: AdminVehicle) {
    setEditingId(v.id)
    setForm({
      name: v.name,
      brand: v.brand,
      category: v.category,
      version: v.version ?? "",
      year: v.year,
      km: v.km,
      transmission: v.transmission,
      fuel: v.fuel,
      color: v.color,
      engine: v.engine ?? "",
      doors: v.doors ?? "",
      steering: v.steering ?? "",
      traction: v.traction ?? "",
      bodywork: v.bodywork ?? "",
      condition: v.condition ?? "",
      origin: v.origin ?? "",
      ipva: v.ipva ?? "",
      sinistro: v.sinistro ?? "",
      chassi: v.chassi ?? "",
      renavam: v.renavam ?? "",
      placa: v.placa ?? "",
      price: v.price,
      status: v.status,
      note: v.note ?? "",
      images: v.images ?? [],
      active: v.active,
    })
    setOpen(true)
  }

  function set<K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    startTransition(async () => {
      if (editingId) await updateVehicle(editingId, form)
      else await createVehicle(form)
      setOpen(false)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este veículo permanentemente?")) return
    startTransition(async () => {
      await deleteVehicle(id)
      router.refresh()
    })
  }

  function toggleActive(v: AdminVehicle) {
    startTransition(async () => {
      await setVehicleActive(v.id, !v.active)
      router.refresh()
    })
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Lotes / Veículos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {initialVehicles.length} veículos cadastrados ·{" "}
            {initialVehicles.filter((v) => v.active).length} ativos
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition active:scale-[0.99]"
        >
          <Plus className="size-4" />
          Novo veículo
        </button>
      </header>

      <label className="mb-4 flex max-w-sm items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por marca ou modelo"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="space-y-3">
        {filtered.map((v) => (
          <div
            key={v.id}
            className={cn(
              "flex items-center gap-4 rounded-2xl border border-border bg-card p-3",
              !v.active && "opacity-60",
            )}
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              {v.image ? (
                <Image
                  src={v.image || "/placeholder.svg"}
                  alt={v.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-muted-foreground">
                  <Car className="size-6" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-foreground">
                  {v.name}
                </p>
                <StatusBadge status={v.status} />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {v.brand} · {v.year} · {v.km}
              </p>
              <p className="mt-0.5 text-sm font-bold text-primary">
                {formatBRL(v.price)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => toggleActive(v)}
                disabled={pending}
                aria-label={v.active ? "Desativar" : "Ativar"}
                title={v.active ? "Desativar (esconder)" : "Ativar (mostrar)"}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:text-foreground"
              >
                {v.active ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => openEdit(v)}
                aria-label="Editar"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:text-foreground"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(v.id)}
                disabled={pending}
                aria-label="Excluir"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Nenhum veículo encontrado.
          </div>
        )}
      </div>

      {open && (
        <VehicleFormModal
          editing={!!editingId}
          form={form}
          set={set}
          onClose={() => setOpen(false)}
          onSave={save}
          pending={pending}
        />
      )}
    </div>
  )
}

function VehicleFormModal({
  editing,
  form,
  set,
  onClose,
  onSave,
  pending,
}: {
  editing: boolean
  form: VehicleInput
  set: <K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) => void
  onClose: () => void
  onSave: () => void
  pending: boolean
}) {
  const field =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
  const label = "mb-1 block text-xs font-semibold text-foreground"

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-card sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            {editing ? "Editar veículo" : "Novo veículo"}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <span className={label}>Fotos do veículo</span>
            <ImageUploader
              images={form.images}
              onChange={(imgs) => set("images", imgs)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={label}>Nome / Modelo</label>
              <input
                className={field}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ex: Fiat Strada Volcano CD"
              />
            </div>
            <div>
              <label className={label}>Marca</label>
              <input
                className={field}
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Ex: Fiat"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Versão</label>
              <input
                className={field}
                value={form.version}
                onChange={(e) => set("version", e.target.value)}
                placeholder="Ex: 1.3 Firefly Flex Volcano CD Manual"
              />
            </div>
            <div>
              <label className={label}>Categoria</label>
              <select
                className={field}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select
                className={field}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Ano</label>
              <input
                className={field}
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2023/2024"
              />
            </div>
            <div>
              <label className={label}>Quilometragem</label>
              <input
                className={field}
                value={form.km}
                onChange={(e) => set("km", e.target.value)}
                placeholder="9.790 km"
              />
            </div>
            <div>
              <label className={label}>Câmbio</label>
              <input
                className={field}
                value={form.transmission}
                onChange={(e) => set("transmission", e.target.value)}
                placeholder="Manual"
              />
            </div>
            <div>
              <label className={label}>Combustível</label>
              <input
                className={field}
                value={form.fuel}
                onChange={(e) => set("fuel", e.target.value)}
                placeholder="Flex"
              />
            </div>
            <div>
              <label className={label}>Cor</label>
              <input
                className={field}
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="Cinza"
              />
            </div>
            <div>
              <label className={label}>Preço (R$)</label>
              <input
                type="number"
                className={field}
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                placeholder="36400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Observação (opcional)</label>
              <input
                className={field}
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="Ex: Recuperado de financiamento"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 font-heading text-sm font-extrabold text-foreground">
              Ficha técnica
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={label}>Motor</label>
                <input
                  className={field}
                  value={form.engine}
                  onChange={(e) => set("engine", e.target.value)}
                  placeholder="Ex: 1.3 Firefly"
                />
              </div>
              <div>
                <label className={label}>Portas</label>
                <input
                  className={field}
                  value={form.doors}
                  onChange={(e) => set("doors", e.target.value)}
                  placeholder="Ex: 4"
                />
              </div>
              <div>
                <label className={label}>Direção</label>
                <input
                  className={field}
                  value={form.steering}
                  onChange={(e) => set("steering", e.target.value)}
                  placeholder="Ex: Elétrica"
                />
              </div>
              <div>
                <label className={label}>Tração</label>
                <input
                  className={field}
                  value={form.traction}
                  onChange={(e) => set("traction", e.target.value)}
                  placeholder="Ex: Dianteira / 4x2"
                />
              </div>
              <div>
                <label className={label}>Carroceria</label>
                <input
                  className={field}
                  value={form.bodywork}
                  onChange={(e) => set("bodywork", e.target.value)}
                  placeholder="Ex: Picape"
                />
              </div>
              <div>
                <label className={label}>Condição</label>
                <input
                  className={field}
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value)}
                  placeholder="Ex: Recuperado"
                />
              </div>
              <div>
                <label className={label}>Origem</label>
                <input
                  className={field}
                  value={form.origin}
                  onChange={(e) => set("origin", e.target.value)}
                  placeholder="Ex: Financeira"
                />
              </div>
              <div>
                <label className={label}>IPVA</label>
                <input
                  className={field}
                  value={form.ipva}
                  onChange={(e) => set("ipva", e.target.value)}
                  placeholder="Ex: Pago"
                />
              </div>
              <div>
                <label className={label}>Sinistro</label>
                <input
                  className={field}
                  value={form.sinistro}
                  onChange={(e) => set("sinistro", e.target.value)}
                  placeholder="Ex: Sem registro"
                />
              </div>
              <div>
                <label className={label}>Placa</label>
                <input
                  className={field}
                  value={form.placa}
                  onChange={(e) => set("placa", e.target.value)}
                  placeholder="Ex: AHV1D28"
                />
              </div>
              <div>
                <label className={label}>Chassi</label>
                <input
                  className={field}
                  value={form.chassi}
                  onChange={(e) => set("chassi", e.target.value)}
                  placeholder="Ex: 9BD..."
                />
              </div>
              <div>
                <label className={label}>Renavam</label>
                <input
                  className={field}
                  value={form.renavam}
                  onChange={(e) => set("renavam", e.target.value)}
                  placeholder="Ex: 310..."
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            <span className="text-sm font-medium text-foreground">
              Veículo ativo (visível na vitrine)
            </span>
          </label>
        </div>

        <div className="flex gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold text-foreground"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={pending || !form.name || !form.brand}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition active:scale-[0.99] disabled:opacity-60"
          >
            {pending ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  )
}
