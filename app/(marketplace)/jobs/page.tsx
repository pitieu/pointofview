import Link from "next/link"

import { Button } from "@/components/ui/button"

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
