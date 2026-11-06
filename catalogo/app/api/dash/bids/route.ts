import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth-admin"
import { listBids } from "@/lib/actions/bids"

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const bids = await listBids()
  return NextResponse.json(bids)
}
