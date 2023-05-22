import React from "react"
import { JobSchemaType } from "@/schema/job.schema"

import { Icons } from "@/components/icons"

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
  data: JobSchemaType
}

export const JobItem: React.FC<JobItemProps> = ({ data, user }) => {
  const calcBudget = () => {
    if (data.budget && data.urls.length > 0) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.floor(data.budget * data.urls.length))
    }
    return 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">
          {data.title || "Untitled"}
        </CardTitle>
        <CardDescription className="line-clamp-4">
          {data.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center gap-1">
          <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
            {calcBudget() || "FREE"}
          </Badge>{" "}
          <Badge variant="secondary" className="gap-1 ">
            <Icons.page width={16} height={16} />
            {data.urls.length}
          </Badge>
          <Badge variant="secondary" className="gap-1 ">
            <Icons.time width={16} height={16} />
            {data.deadline && data.deadline[0] > 0
              ? `${data.deadline[0]}`
              : "No deadline"}
            {data.deadline &&
              data.deadline[0] > 0 &&
              (data.deadline[0] == 1 ? " day" : " days")}
          </Badge>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-row items-center gap-4">
          <UserAvatar
            user={{ name: user?.name || "cho", image: user?.image || "" }}
            className="h-8 w-8"
          />
          <div>Cho</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobItem
