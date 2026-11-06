import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getDashboardStats } from "@/lib/actions/settings"
import { listBids } from "@/lib/actions/bids"
import { ReportsView } from "@/components/dash/reports-view"

export const dynamic = "force-dynamic"

export default async function RelatoriosPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const [stats, bids] = await Promise.all([getDashboardStats(), listBids()])
  return <ReportsView stats={stats} bids={bids} />
}
