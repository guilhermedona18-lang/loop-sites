"use server"

import { db } from "@/lib/db"
import { vehicles } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import type { Vehicle } from "@/lib/loop-data"
import { requireAdmin } from "@/lib/auth-admin"
import { dispatchIntegrationEvent } from "@/lib/integrations/webhook"

function rowToVehicle(row: typeof vehicles.$inferSelect): Vehicle & {
  active: boolean
  sortOrder: number
} {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category as Vehicle["category"],
    version: row.version ?? undefined,
    year: row.year,
    km: row.km,
    transmission: row.transmission,
    fuel: row.fuel,
    color: row.color,
    engine: row.engine,
    doors: row.doors,
    steering: row.steering,
    traction: row.traction,
    bodywork: row.bodywork,
    condition: row.condition,
    origin: row.origin,
    ipva: row.ipva,
    sinistro: row.sinistro,
    chassi: row.chassi,
    renavam: row.renavam,
    placa: row.placa,
    price: row.price,
    bids: row.bids,
    status: row.status as Vehicle["status"],
    note: row.note ?? undefined,
    image: row.image,
    images: (row.images as string[]) ?? [],
    active: row.active,
    sortOrder: row.sortOrder,
  }
}

/** Públicos: somente veículos ativos, ordenados. */
export async function getPublicVehicles(): Promise<Vehicle[]> {
  try {
    const rows = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.active, true))
      .orderBy(asc(vehicles.sortOrder), desc(vehicles.createdAt))
    // Só exibe publicamente veículos que já possuem ao menos uma imagem.
    return rows
      .map(rowToVehicle)
      .filter((v) => (v.images && v.images.length > 0) || Boolean(v.image))
  } catch (err) {
    // Banco indisponível (ex.: cota excedida): não derruba a vitrine.
    console.error("[v0] getPublicVehicles falhou:", (err as Error)?.message ?? err)
    return []
  }
}

/** Admin: todos os veículos (ativos e inativos). */
export async function getAllVehicles() {
  await requireAdmin()
  const rows = await db
    .select()
    .from(vehicles)
    .orderBy(asc(vehicles.sortOrder), desc(vehicles.createdAt))
  return rows.map(rowToVehicle)
}

export type VehicleInput = {
  id?: string
  name: string
  brand: string
  category: string
  version?: string
  year: string
  km: string
  transmission: string
  fuel: string
  color: string
  engine?: string
  doors?: string
  steering?: string
  traction?: string
  bodywork?: string
  condition?: string
  origin?: string
  ipva?: string
  sinistro?: string
  chassi?: string
  renavam?: string
  placa?: string
  price: number
  status: string
  note?: string
  images: string[]
  active: boolean
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

export async function createVehicle(input: VehicleInput) {
  await requireAdmin()
  const baseId = input.id?.trim() || `${slugify(input.brand + "-" + input.name)}-${Date.now().toString().slice(-5)}`
  const images = input.images.filter(Boolean)
  const maxOrder = await db
    .select({ v: vehicles.sortOrder })
    .from(vehicles)
    .orderBy(desc(vehicles.sortOrder))
    .limit(1)
  const nextOrder = (maxOrder[0]?.v ?? 0) + 1

  await db.insert(vehicles).values({
    id: baseId,
    name: input.name,
    brand: input.brand,
    category: input.category,
    version: input.version || null,
    year: input.year,
    km: input.km,
    transmission: input.transmission,
    fuel: input.fuel,
    color: input.color,
    engine: input.engine || "",
    doors: input.doors || "",
    steering: input.steering || "",
    traction: input.traction || "",
    bodywork: input.bodywork || "",
    condition: input.condition || "",
    origin: input.origin || "",
    ipva: input.ipva || "",
    sinistro: input.sinistro || "",
    chassi: input.chassi || "",
    renavam: input.renavam || "",
    placa: input.placa || "",
    price: input.price,
    status: input.status,
    note: input.note || null,
    image: images[0] ?? "",
    images,
    active: input.active,
    sortOrder: nextOrder,
  })
  revalidatePath("/")
  revalidatePath("/dash/lotes")
  after(() => dispatchIntegrationEvent("vehicle", { action: "created", id: baseId, ...input, images }))
  return { ok: true, id: baseId }
}

export async function updateVehicle(id: string, input: VehicleInput) {
  await requireAdmin()
  const images = input.images.filter(Boolean)
  await db
    .update(vehicles)
    .set({
      name: input.name,
      brand: input.brand,
      category: input.category,
      version: input.version || null,
      year: input.year,
      km: input.km,
      transmission: input.transmission,
      fuel: input.fuel,
      color: input.color,
      engine: input.engine || "",
      doors: input.doors || "",
      steering: input.steering || "",
      traction: input.traction || "",
      bodywork: input.bodywork || "",
      condition: input.condition || "",
      origin: input.origin || "",
      ipva: input.ipva || "",
      sinistro: input.sinistro || "",
      chassi: input.chassi || "",
      renavam: input.renavam || "",
      placa: input.placa || "",
      price: input.price,
      status: input.status,
      note: input.note || null,
      image: images[0] ?? "",
      images,
      active: input.active,
    })
    .where(eq(vehicles.id, id))
  revalidatePath("/")
  revalidatePath("/dash/lotes")
  after(() => dispatchIntegrationEvent("vehicle", { action: "updated", id, ...input, images }))
  return { ok: true }
}

export async function setVehicleActive(id: string, active: boolean) {
  await requireAdmin()
  await db.update(vehicles).set({ active }).where(eq(vehicles.id, id))
  revalidatePath("/")
  revalidatePath("/dash/lotes")
  return { ok: true }
}

export async function deleteVehicle(id: string) {
  await requireAdmin()
  await db.delete(vehicles).where(eq(vehicles.id, id))
  revalidatePath("/")
  revalidatePath("/dash/lotes")
  return { ok: true }
}
