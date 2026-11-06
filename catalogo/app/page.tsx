import { LoopApp } from "@/components/loop/loop-app"
import { getPublicVehicles } from "@/lib/actions/vehicles"

export const dynamic = "force-dynamic"

export default async function Page() {
  const vehicles = await getPublicVehicles()
  return <LoopApp vehicles={vehicles} />
}
