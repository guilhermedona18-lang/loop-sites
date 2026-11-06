"use server"

import { db } from "@/lib/db"
import { auctionUsers } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { requireAdmin } from "@/lib/auth-admin"
import { dispatchIntegrationEvent } from "@/lib/integrations/webhook"

export async function getUsers() {
  await requireAdmin()
  return db.select().from(auctionUsers).orderBy(desc(auctionUsers.createdAt))
}

export type UserInput = {
  name: string
  email: string
  phone: string
  city: string
  role: string
  status: string
}

export async function createUser(input: UserInput) {
  await requireAdmin()
  const [created] = await db.insert(auctionUsers).values(input).returning()
  revalidatePath("/dash/usuarios")
  after(() => dispatchIntegrationEvent("user", created))
  return { ok: true }
}

export async function updateUser(id: number, input: UserInput) {
  await requireAdmin()
  await db.update(auctionUsers).set(input).where(eq(auctionUsers.id, id))
  revalidatePath("/dash/usuarios")
  return { ok: true }
}

export async function deleteUser(id: number) {
  await requireAdmin()
  await db.delete(auctionUsers).where(eq(auctionUsers.id, id))
  revalidatePath("/dash/usuarios")
  return { ok: true }
}
