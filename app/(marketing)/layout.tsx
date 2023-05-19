import React from "react"
import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import LoginOrUserAccount from "@/components/loginOrUserAccount"
import { MainNav } from "@/components/navigation/main-nav"
import { UserAccountNav } from "@/components/navigation/user-account-nav"
import { SiteFooter } from "@/components/site-footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />{" "}
          <LoginOrUserAccount user={user} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
