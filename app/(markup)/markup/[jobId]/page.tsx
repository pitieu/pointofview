import { headers } from "next/headers"

import { getCurrentUser } from "@/lib/session"
import { trpc } from "@/lib/trpc"

import Markup from "./markup"

export default async function MarkupPage({ params }) {
  const headersList = headers()
  const myHost = headersList.get("host")
  const user = await getCurrentUser()

  return (
    <div>
      {myHost && params.jobId && (
        <Markup host={myHost} id={params.jobId} userId={user?.id || null} />
      )}
    </div>
  )
}
