"use server"

import { db } from "@/lib/db"
import { auctions } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-admin"

export async function getAuctions() {
  await requireAdmin()
  return db.select().from(auctions).orderBy(desc(auctions.createdAt))
}

export type AuctionInput = {
  title: string
  description: string
  status: string
  startsAt: string | null
  endsAt: string | null
}

export async function createAuction(input: AuctionInput) {
  await requireAdmin()
  await db.insert(auctions).values({
    title: input.title,
    description: input.description,
    status: input.status,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
  })
  revalidatePath("/dash/leiloes")
  return { ok: true }
}

export async function updateAuction(id: number, input: AuctionInput) {
  await requireAdmin()
  await db
    .update(auctions)
    .set({
      title: input.title,
      description: input.description,
      status: input.status,
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
    })
    .where(eq(auctions.id, id))
  revalidatePath("/dash/leiloes")
  return { ok: true }
}

export async function deleteAuction(id: number) {
  await requireAdmin()
  await db.delete(auctions).where(eq(auctions.id, id))
  revalidatePath("/dash/leiloes")
  return { ok: true }
}
