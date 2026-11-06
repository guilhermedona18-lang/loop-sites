import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getAllVehicles } from "@/lib/actions/vehicles"
import { FinancingSimulator } from "@/components/dash/financing-simulator"

export const dynamic = "force-dynamic"

export default async function SimulacaoPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const vehicles = await getAllVehicles()
  const options = vehicles.map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    image: v.image,
  }))

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">
          Simular financiamento
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione um veículo, ajuste os valores e gere a proposta pré-aprovada em PDF.
        </p>
      </header>

      <FinancingSimulator vehicles={options} />
    </div>
  )
}
