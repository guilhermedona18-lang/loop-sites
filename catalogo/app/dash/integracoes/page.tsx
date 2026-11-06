import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getIntegration } from "@/lib/actions/integrations"
import { IntegrationsManager } from "@/components/dash/integrations-manager"

export const dynamic = "force-dynamic"

export default async function IntegracoesPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const { config, last } = await getIntegration()
  return <IntegrationsManager initialConfig={config} initialLast={last} />
}
