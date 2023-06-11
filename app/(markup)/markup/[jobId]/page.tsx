import { getCurrentUser } from "@/lib/session"

import Markup from "./markup"

export default async function MarkupPage({ params }) {
  const user = await getCurrentUser()

  return (
    <div>
      {params.jobId && (
        <Markup jobId={params.jobId} userId={user?.id || null} />
      )}
    </div>
  )
}
