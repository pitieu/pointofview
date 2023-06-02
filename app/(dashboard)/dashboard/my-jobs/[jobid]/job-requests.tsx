"use client"

import { FC } from "react"
import Image from "next/image"

import { trpc } from "@/lib/trpc"

interface JobRequestsProps {
  jobid: string
}

const JobRequests: FC<JobRequestsProps> = ({ jobid }) => {
  //   const {
  //     data: job = { title: null },
  //     isLoading,
  //     refetch,
  //   } = trpc.job.fetchJobRequestsHandler.useQuery(
  //     { id: jobid },
  //     { trpc: { abortOnUnmount: true } }
  //   )
  //   if (!job?.title) {
  //     return <div>loading...</div>
  //   }

  return (
    <div>
      job-requests
      {/* {JSON.stringify(job)} */}
    </div>
  )
}

export default JobRequests
