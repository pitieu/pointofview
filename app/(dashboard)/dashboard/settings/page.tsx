import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { SocialNetworksForm } from "@/components/forms/social-networks-form"
import { UserAccountForm } from "@/components/forms/user-account-form"
import { DashboardHeader } from "@/components/header"
import PortfolioList from "@/components/portfolio-list"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  // const socialNetworks = await fetch(`/api/users/${user.id}/networks`)
  const socialNetworks = []
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserAccountForm
          user={{
            id: user.id,
            username: user.username || "",
            name: user.name || "",
            bio: user.bio || "",
          }}
        />
        {/* <PortfolioList /> */}
        {/* <SocialNetworksForm userId={user.id} socialNetworks={socialNetworks} /> */}
      </div>
    </DashboardShell>
  )
}
