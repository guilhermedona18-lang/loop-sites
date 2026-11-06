import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-admin"
import { getUsers } from "@/lib/actions/users"
import { UsersManager } from "@/components/dash/users-manager"

export const dynamic = "force-dynamic"

export default async function UsuariosPage() {
  if (!(await isAuthenticated())) redirect("/dash/login")
  const users = await getUsers()
  return <UsersManager initialUsers={users} />
}
