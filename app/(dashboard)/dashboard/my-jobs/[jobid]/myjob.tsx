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
  } = trpc.job.myJob.fetch.useQuery(
    { id: jobid },
    { trpc: { abortOnUnmount: true } }
  )
  if (!job?.title) {
    return <div>loading...</div>
  }

  return (
    <div className="flex flex-row gap-2">
      <div className="flex w-4/12 flex-col bg-yellow-700">
        <div className="flex flex-row gap-4">
          {job?.urls.map((urlData) => (
            <div className="flex flex-col gap-4">
              {urlData.thumbnail && (
                <Link target="_blank" href={urlData.image || "#"}>
                  <Image
                    src={urlData.thumbnail}
                    alt="website preview"
                    className="rounded-lg"
                    width={200}
                    height={200}
                  />
                </Link>
              )}
              <div>{urlData.url}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-6/12 bg-green-700">MidContent</div>
      <div className="w-2/12 bg-blue-700">
        <h1 className="sm:test-3xl text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200">
          {job?.title}
        </h1>
        <div>{job?.description}</div>
        <div className="flex flex-col">
          {/* <div>{job?.status}</div> */}
          {/* <div>{job?.state}</div> */}
          <div>{job?.published ? "true" : "false"}</div>
          <div>{job?.budget}</div>
          <div>{job?.deadline}</div>
        </div>
      </div>
    </div>
  )
}

export default Myjob
