import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getAllVehicles } from "@/lib/actions/vehicles"
import { VehiclesManager } from "@/components/dash/vehicles-manager"

export const dynamic = "force-dynamic"

export default async function LotesPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const vehicles = await getAllVehicles()
  return <VehiclesManager initialVehicles={vehicles} />
}
