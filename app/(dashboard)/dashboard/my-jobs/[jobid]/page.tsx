import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

import JobRequests from "./job-requests"
import MyJob from "./myjob"

export const metadata = {
  title: "My Job",
}

export default async function MyJobPage({ params }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <>
      <MyJob jobid={params.jobid} />
      <JobRequests jobid={params.jobid} />
    </>
  )
}
