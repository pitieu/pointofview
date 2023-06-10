"use client"

import { FC } from "react"

import { trpc } from "@/lib/trpc"
import { columns } from "@/components/tables/my-jobs/columns"
import { DataTable } from "@/components/tables/my-jobs/data-table"

interface MyJobListProps {}

const MyJobList: FC<MyJobListProps> = ({}) => {
  const {
    data: jobs = [],
    isLoading,
    refetch,
  } = trpc.job.myJob.list.useQuery({}, { trpc: { abortOnUnmount: true } })

  return (
    <div>
      <DataTable
        columns={columns}
        data={jobs}
        isLoading={isLoading}
        refetch={refetch}
      />
    </div>
  )
}

export default MyJobList
