import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

import MyJobList from "./my-job-list"

export const metadata = {
  title: "My Job",
}

export default async function MyJobsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <div>
      <MyJobList />
    </div>
  )
}
