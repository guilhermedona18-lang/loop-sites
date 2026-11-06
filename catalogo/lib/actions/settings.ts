"use server"

import { db } from "@/lib/db"
import { settings, vehicles, bids, auctionUsers } from "@/lib/db/schema"
import { count, eq, sum, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-admin"

export async function getSettings(): Promise<Record<string, string>> {
  await requireAdmin()
  const rows = await db.select().from(settings)
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function saveSettings(values: Record<string, string>) {
  await requireAdmin()
  for (const [key, value] of Object.entries(values)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } })
  }
  revalidatePath("/dash/configuracoes")
  return { ok: true }
}

export type DashboardStats = {
  totalVehicles: number
  activeVehicles: number
  inactiveVehicles: number
  totalBids: number
  newBids: number
  totalUsers: number
  inventoryValue: number
  soldValue: number
  byCategory: { category: string; total: number }[]
  recentBids: {
    id: number
    vehicleName: string
    bidderName: string
    amount: number
    status: string
  }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin()

  const [vehAgg] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) FILTER (WHERE ${vehicles.active})`,
      inventory: sql<number>`COALESCE(SUM(${vehicles.price}) FILTER (WHERE ${vehicles.active}), 0)`,
    })
    .from(vehicles)

  const [bidAgg] = await db
    .select({
      total: count(),
      news: sql<number>`count(*) FILTER (WHERE ${bids.status} = 'novo')`,
      sold: sql<number>`COALESCE(SUM(${bids.amount}) FILTER (WHERE ${bids.status} = 'vencedor'), 0)`,
    })
    .from(bids)

  const [userAgg] = await db.select({ total: count() }).from(auctionUsers)

  const cats = await db
    .select({ category: vehicles.category, total: count() })
    .from(vehicles)
    .where(eq(vehicles.active, true))
    .groupBy(vehicles.category)

  const recent = await db
    .select({
      id: bids.id,
      vehicleName: bids.vehicleName,
      bidderName: bids.bidderName,
      amount: bids.amount,
      status: bids.status,
    })
    .from(bids)
    .orderBy(sql`${bids.createdAt} DESC`)
    .limit(6)

  const total = Number(vehAgg?.total ?? 0)
  const active = Number(vehAgg?.active ?? 0)

  return {
    totalVehicles: total,
    activeVehicles: active,
    inactiveVehicles: total - active,
    totalBids: Number(bidAgg?.total ?? 0),
    newBids: Number(bidAgg?.news ?? 0),
    totalUsers: Number(userAgg?.total ?? 0),
    inventoryValue: Number(vehAgg?.inventory ?? 0),
    soldValue: Number(bidAgg?.sold ?? 0),
    byCategory: cats.map((c) => ({ category: c.category, total: Number(c.total) })),
    recentBids: recent.map((r) => ({
      id: r.id,
      vehicleName: r.vehicleName,
      bidderName: r.bidderName,
      amount: r.amount,
      status: r.status,
    })),
  }
}
