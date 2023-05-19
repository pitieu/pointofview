import { redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import LoginOrUserAccount from "@/components/loginOrUserAccount"
import { MainNav } from "@/components/navigation/main-nav"
import { DashboardNav } from "@/components/navigation/nav"
import { UserAccountNav } from "@/components/navigation/user-account-nav"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <LoginOrUserAccount user={user} />
        </div>
      </header>
      <div className="container mx-auto bg-gray-50 py-6">{children}</div>
    </div>
  )
}
