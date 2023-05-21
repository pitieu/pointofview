"use client"

import Link from "next/link"
import { JobSchemaType } from "@/schema/job.schema"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDownAZ, ArrowUpAZ, MoreHorizontal } from "lucide-react"
import moment from "moment"

import { trpc } from "@/lib/trpc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-sort-header"

export type tableColumns = {
  id: string
  title: string
  budget: number | null
  published: boolean
  createdAt: Date
  jobs?: number
}

export const columns: ColumnDef<tableColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" type="Characters" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`dashboard/my-jobs/${row.original.id}`}>
          {row.original.title}
        </Link>
      )
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      if (row.original.budget === 0) return <span>FREE</span>
      return <span>{row.original.budget} USD</span>
    },
  },
  {
    accessorKey: "published",
    header: "Published",
    cell: ({ row }) => {
      if (row.original.published) {
        return (
          <Badge variant={"success"}>
            <Icons.check width={16} height={16} />
          </Badge>
        )
      }
      return (
        <Badge>
          <Icons.close width={16} height={16} />
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return moment(row.original.createdAt).format("DD MMM YYYY HH:mm")
    },
  },
  {
    accessorKey: "jobs",
    header: "Requests",
    cell: ({ row }) => {
      return <span>{row.original.jobs || 0}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const columnId = row.original.id
      const deleteRow = trpc.job.deleteMyJobHandler.useMutation({
        onSuccess: () => {
          table.options.meta?.refetch()
        },
      })

      return !deleteRow.isLoading ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-500 hover:text-red-600"
              onClick={() => {
                deleteRow.mutate({ id: columnId })
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Icons.spinner className="h-4 w-4 animate-spin" />
      )
    },
  },
]
