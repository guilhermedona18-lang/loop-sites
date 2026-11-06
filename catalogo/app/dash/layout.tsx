import type { ReactNode } from "react"
import { DashShell } from "@/components/dash/dash-shell"
import { isAuthenticated } from "@/lib/auth-admin"

export const dynamic = "force-dynamic"

export default async function DashLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated()
  // A página de login renderiza sem o shell; quando não autenticado,
  // as próprias páginas redirecionam para /dash/login.
  if (!authed) return <>{children}</>
  return <DashShell>{children}</DashShell>
}
