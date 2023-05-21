"use client"

import { FC, useState } from "react"

import { AddJobForm } from "@/components/forms/add-job-form"
import { JobItem } from "@/components/job-item"

interface AddJobsProps {}

const AddJobsPage: FC<AddJobsProps> = () => {
  const [formData, setFormData] = useState({
    title: "",
    budget: 0,
    published: false,
    deadline: "",
    description: "",
    urls: [{ id: "url-1", value: "" }],
    credentials: [{ id: "cred-1", label: "", username: "", password: "" }],
  })

  return (
    <>
      <div className="relative grid grid-cols-3 gap-6 md:grid-cols-4 ">
        <div className="col-span-1 hidden lg:block" />
        <AddJobForm
          change={setFormData}
          className="col-span-4  md:col-span-3 lg:col-span-2"
        />
        <div className="invisible sticky top-[80px] col-span-1 h-[200px] min-w-[200px] md:visible">
          <h2 className="mb-2 text-lg font-semibold">Preview</h2>
          <JobItem formData={formData} />
        </div>
      </div>
    </>
  )
}

export default AddJobsPage
