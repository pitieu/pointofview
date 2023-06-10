import Link from "next/link"

import { dashboardConfig } from "@/config/dashboard"
import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/navigation/nav"

export default async function JobsPage() {
  return (
    <>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="">
          <Link href="/jobs/add">
            <Button>Add Job</Button>
          </Link>
          Jobs
        </div>
      </main>
    </>
  )
}
