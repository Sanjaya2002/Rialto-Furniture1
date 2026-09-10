import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers()
  const pathname = headerStore.get("x-pathname") ?? ""

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup"

  if (isAuthPage || !pathname) {
    return <>{children}</>
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-[#18344A]">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  )
}