import React, { useCallback } from "react"
import { JobSchemaType } from "@/schema/job.schema"
import { toCurrencyFormat } from "@/utils/number-helpers"
import { User } from "@prisma/client"

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
  user: User
}

export const JobItem: React.FC<JobItemProps> = ({ data, user }) => {
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
            {data.budget || "FREE"}
          </Badge>{" "}
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
