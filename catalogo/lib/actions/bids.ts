"use server"

import { db } from "@/lib/db"
import { bids } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { requireAdmin } from "@/lib/auth-admin"
import { dispatchIntegrationEvent } from "@/lib/integrations/webhook"

export type BidRow = typeof bids.$inferSelect

export async function listBids(): Promise<BidRow[]> {
  await requireAdmin()
  return db.select().from(bids).orderBy(desc(bids.createdAt))
}

export async function createBid(formData: FormData) {
  await requireAdmin()
  const [created] = await db
    .insert(bids)
    .values({
      vehicleId: String(formData.get("vehicleId") ?? ""),
      vehicleName: String(formData.get("vehicleName") ?? ""),
      bidderName: String(formData.get("bidderName") ?? ""),
      bidderPhone: String(formData.get("bidderPhone") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      status: "novo",
    })
    .returning()
  revalidatePath("/dash/lances")
  revalidatePath("/dash")
  after(() => dispatchIntegrationEvent("bid", created))
  return { ok: true }
}

export async function updateBidStatus(id: number, status: string) {
  await requireAdmin()
  await db.update(bids).set({ status }).where(eq(bids.id, id))
  revalidatePath("/dash/lances")
  return { ok: true }
}

export async function deleteBid(id: number) {
  await requireAdmin()
  await db.delete(bids).where(eq(bids.id, id))
  revalidatePath("/dash/lances")
  return { ok: true }
}
