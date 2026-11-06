import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getSettings } from "@/lib/actions/settings"
import { SettingsManager } from "@/components/dash/settings-manager"
import { ImageMigrationCard } from "@/components/dash/image-migration-card"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const settings = await getSettings()
  return (
    <div className="space-y-6">
      <SettingsManager initialSettings={settings} />
      <ImageMigrationCard />
    </div>
  )
}
