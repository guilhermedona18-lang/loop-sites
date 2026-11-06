"use server"

import { db } from "@/lib/db"
import { arremates, vehicles } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth-admin"
import { isValidCPF, onlyDigits } from "@/lib/cpf"
import type { Vehicle } from "@/lib/loop-data"

export type SaveArremateInput = {
  cpf: string
  clientName: string
  vehicleId: string
  vehicleName: string
  vehicleImage: string
  lote: string
  placa: string
  price: number
  entrada: number
  totalFinanciado: number
  parcelas: number
  /** Valor da parcela em reais (com centavos). */
  valorParcela: number
}

/**
 * Registra o arremate vinculado ao CPF do cliente.
 * Chamado quando o admin gera o PDF da proposta.
 */
export async function saveArremate(input: SaveArremateInput) {
  await requireAdmin()
  const cpf = onlyDigits(input.cpf)
  if (!isValidCPF(cpf)) {
    return { ok: false as const, message: "CPF inválido — não foi possível registrar o arremate." }
  }

  await db.insert(arremates).values({
    cpf,
    clientName: input.clientName || "",
    vehicleId: input.vehicleId || "",
    vehicleName: input.vehicleName || "",
    vehicleImage: input.vehicleImage || "",
    lote: input.lote || "",
    placa: input.placa || "",
    price: Math.round(input.price || 0),
    entrada: Math.round(input.entrada || 0),
    totalFinanciado: Math.round(input.totalFinanciado || 0),
    parcelas: Math.round(input.parcelas || 0),
    valorParcelaCents: Math.round((input.valorParcela || 0) * 100),
  })

  return { ok: true as const }
}

export type ArremateResult = {
  clientName: string
  cpf: string
  vehicleName: string
  vehicleImage: string
  lote: string
  placa: string
  price: number
  entrada: number
  totalFinanciado: number
  parcelas: number
  valorParcela: number
  createdAt: string
  vehicle: Vehicle | null
}

/**
 * Consulta pública: só retorna o veículo arrematado se o CPF for válido
 * (algoritmo oficial) E existir um arremate registrado para ele.
 */
export async function lookupArremate(
  cpfRaw: string,
): Promise<{ ok: true; arremate: ArremateResult } | { ok: false; error: string }> {
  await requireAdmin()
  const cpf = onlyDigits(cpfRaw)

  if (cpf.length !== 11) {
    return { ok: false, error: "Digite os 11 dígitos do CPF." }
  }
  if (!isValidCPF(cpf)) {
    return { ok: false, error: "CPF inválido. Verifique os números e tente novamente." }
  }

  const rows = await db
    .select()
    .from(arremates)
    .where(eq(arremates.cpf, cpf))
    .orderBy(desc(arremates.createdAt))
    .limit(1)

  const row = rows[0]
  if (!row) {
    return {
      ok: false,
      error: "Nenhum veículo arrematado encontrado para este CPF.",
    }
  }

  // Busca os dados completos do veículo (fotos, ficha) se ainda existir no catálogo.
  let vehicle: Vehicle | null = null
  if (row.vehicleId) {
    const v = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, row.vehicleId))
      .limit(1)
    if (v[0]) {
      const r = v[0]
      vehicle = {
        id: r.id,
        name: r.name,
        brand: r.brand,
        category: r.category as Vehicle["category"],
        version: r.version ?? undefined,
        year: r.year,
        km: r.km,
        transmission: r.transmission,
        fuel: r.fuel,
        color: r.color,
        price: r.price,
        bids: r.bids,
        status: r.status as Vehicle["status"],
        note: r.note ?? undefined,
        image: r.image,
        images: (r.images as string[]) ?? [],
      }
    }
  }

  return {
    ok: true,
    arremate: {
      clientName: row.clientName,
      cpf: row.cpf,
      vehicleName: row.vehicleName,
      vehicleImage: row.vehicleImage,
      lote: row.lote,
      placa: row.placa,
      price: row.price,
      entrada: row.entrada,
      totalFinanciado: row.totalFinanciado,
      parcelas: row.parcelas,
      valorParcela: row.valorParcelaCents / 100,
      createdAt: row.createdAt.toISOString(),
      vehicle,
    },
  }
}
