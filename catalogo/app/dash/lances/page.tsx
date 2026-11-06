import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { listBids } from "@/lib/actions/bids"
import { getAllVehicles } from "@/lib/actions/vehicles"
import { BidsManager } from "@/components/dash/bids-manager"

export const dynamic = "force-dynamic"

export default async function LancesPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const [bids, vehicles] = await Promise.all([listBids(), getAllVehicles()])
  return (
    <BidsManager
      initialBids={bids}
      vehicles={vehicles.map((v) => ({ id: v.id, name: v.name }))}
    />
  )
}
