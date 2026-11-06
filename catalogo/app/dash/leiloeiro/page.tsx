import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { listBids } from "@/lib/actions/bids"
import { getAllVehicles } from "@/lib/actions/vehicles"
import { AuctioneerView } from "@/components/dash/auctioneer-view"

export const dynamic = "force-dynamic"

export default async function LeiloeiroPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const [bids, vehicles] = await Promise.all([listBids(), getAllVehicles()])
  return (
    <AuctioneerView
      initialBids={bids}
      vehicles={vehicles.map((v) => ({ id: v.id, name: v.name, price: v.price, image: v.image, status: v.status }))}
    />
  )
}
