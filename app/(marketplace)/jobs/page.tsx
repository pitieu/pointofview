"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/navigation/nav"

interface JobsProps {}

const JobsPage: FC<JobsProps> = () => {
  const router = useRouter()
  const goTo = (e) => {
    e.preventDefault()
    router.push("/jobs/add")
  }

  return (
    <>
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={dashboardConfig.sidebarNav} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="">
          <Button onClick={goTo}>Add Job</Button>
          Jobs
        </div>
      </main>
    </>
  )
}

export default JobsPage
