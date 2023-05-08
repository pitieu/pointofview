import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { ApiKeyTable } from "@/components/api-key-table"

export const metadata = {
  title: "API keys",
  description: "Manage API keys.",
}

export default async function ApiKeyPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="API keys" text="" />
      <Alert className="!pl-14">
        <Icons.warning />
        <AlertTitle>Keep your keys safe</AlertTitle>
        <AlertDescription>
          Do not share your API key with others, or expose it in the browser or
          other client-side code.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardDescription>
            Your secret API keys are listed below. Please note that we do not
            display your secret API keys again after you generate them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyTable />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
