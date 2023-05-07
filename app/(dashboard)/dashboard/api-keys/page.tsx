import moment from "moment"
import { redirect } from "next/navigation"
import { ApiKey } from "@prisma/client"

import { revalidateTag, revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { getApiKeys } from "@/lib/api-keys"
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

export const metadata = {
  title: "API keys",
  description: "Manage API keys.",
}

export default async function ApiKeyPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }
  async function handleCreateApiKey(formData: FormData) {
    "use server"

    await fetch("/api/api-keys", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ name: formData.get("name") }),
    })
    revalidatePath("/dashboard/api-keys")
    return Promise.resolve()
  }
  const apiKeys = (await getApiKeys(user.id)) as ApiKey[]

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
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b-2 border-slate-100 pb-2 text-left">
                  Name
                </th>
                <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left">
                  Key
                </th>
                <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left">
                  Created
                </th>
                <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    No API keys found.
                  </td>
                </tr>
              )}
              {apiKeys.map((key, index) => (
                <tr key={`key-${index}`}>
                  <td>{key.name}</td>
                  <td>{key.key}</td>
                  <td>{moment(key.createdAt).format("DD MMM YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form action={handleCreateApiKey}>
            <Button>+ Create new API key</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
