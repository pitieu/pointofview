import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

interface PromptLayoutProps {
  children?: React.ReactNode
}

export default async function PromptLayout({ children }: PromptLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container flex-1">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
