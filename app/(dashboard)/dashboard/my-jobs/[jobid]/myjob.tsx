"use client"

import { FC } from "react"
import Image from "next/image"
import Link from "next/link"

import { trpc } from "@/lib/trpc"

interface MyjobProps {
  jobid: string
}

const Myjob: FC<MyjobProps> = ({ jobid }) => {
  const {
    data: job = { title: null },
    isLoading,
    refetch,
  } = trpc.job.fetchMyJobHandler.useQuery(
    { id: jobid },
    { trpc: { abortOnUnmount: true } }
  )
  if (!job?.title) {
    return <div>loading...</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="sm:test-3xl text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200">
        {job?.title}
      </h1>

      <div>{job?.description}</div>
      <div className="flex flex-col">
        <div>{job?.published ? "true" : "false"}</div>
        <div>{job?.budget}</div>
        <div>{job?.deadline}</div>
      </div>
      <div className="flex flex-row">
        {job?.urls.map((urlData) => (
          <div className="flex flex-col gap-4">
            {urlData.thumbnail && (
              <Link target="_blank" href={urlData.image || "#"}>
                <Image
                  src={urlData.thumbnail}
                  alt="website preview"
                  className="rounded-lg"
                  width={300}
                  height={240}
                />
              </Link>
            )}
            <div>{urlData.url}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Myjob
