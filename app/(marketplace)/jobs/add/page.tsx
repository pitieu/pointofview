"use client"

import { FC, useState } from "react"

import { AddJobForm } from "@/components/forms/add-job-form"
import { JobItem } from "@/components/job-item"

interface AddJobsProps {}

const AddJobsPage: FC<AddJobsProps> = () => {
  return (
    <>
      <div className="relative grid grid-cols-3 gap-6 bg-slate-50 p-6 md:grid-cols-4">
        <div className="col-span-1 hidden lg:block " />
        <AddJobForm className="col-span-4  md:col-span-3 lg:col-span-2" />
      </div>
    </>
  )
}

export default AddJobsPage
