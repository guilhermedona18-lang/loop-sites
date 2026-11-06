import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getAuctions } from "@/lib/actions/auctions"
import { AuctionsManager } from "@/components/dash/auctions-manager"

export const dynamic = "force-dynamic"

export default async function LeiloesPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const auctions = await getAuctions()
  return <AuctionsManager initialAuctions={auctions} />
}
