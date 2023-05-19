import React from "react"

import { Icons } from "@/components/icons"

import { FormData } from "./forms/add-job-form"
import { Badge } from "./ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Separator } from "./ui/separator"
import { UserAvatar } from "./user-avatar"

interface JobItemProps {
  formData: FormData
}

export const JobItem: React.FC<JobItemProps> = ({ formData, user }) => {
  const avgBudgetPerUrl = () => {
    if (formData.budget && formData.urls.length > 0) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.floor(formData.budget * formData.urls.length))
    }
    return 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">
          {formData.title || "Untitled"}
        </CardTitle>
        <CardDescription className="line-clamp-4">
          {formData.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center gap-1">
          <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
            {avgBudgetPerUrl() || "---"}
          </Badge>{" "}
          <Badge variant="secondary" className="gap-1 ">
            <Icons.page width={16} height={16} />
            {formData.urls.length}
          </Badge>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-row items-center gap-4">
          <UserAvatar user={{ name: "cho", image: "" }} className="h-8 w-8" />
          <div>Cho</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobItem
