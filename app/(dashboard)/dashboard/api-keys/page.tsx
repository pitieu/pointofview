import moment from "moment"
import { redirect } from "next/navigation"
import { ApiKey } from "@prisma/client"

import { revalidateTag, revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { trpc } from "@/lib/trpc"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { Button } from "@/components/ui/button"
import { ApiKeyTable } from "@/components/api-key-table"
import { useEffect } from "react"

export const metadata = {
  title: "API keys",
  description: "Manage API keys.",
}

export default async function ApiKeyPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  //   const result = trpc.apiKey.createAPIKey.useQuery({
  //     name: "abs",
  //   })

  //   async function handleCreateApiKey(formData: FormData) {
  //     "use client"

  //     console.log(result)

  //     revalidatePath("/dashboard/api-keys")
  //     return Promise.resolve()
  //   }

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
          {/* <CardTitle>Subscription Plan</CardTitle> */}
          <CardDescription>
            Your secret API keys are listed below. Please note that we do not
            display your secret API keys again after you generate them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyTable />
          {/* <form action={handleCreateApiKey}>
            <Button>+ Create new API key</Button>
          </form> */}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
