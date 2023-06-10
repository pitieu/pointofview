"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { JobSchemaType } from "@/schema/job.schema"
import { toCurrencyFormat } from "@/utils/number-helpers"
import { JobUrl } from "@prisma/client"
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
  urls: JobUrl[]
}

export const columns: ColumnDef<tableColumns>[] = [
  {
    accessorKey: "urls",
    header: "",
    cell: ({ row }) => {
      if (!row.original.urls.length) return null
      if (!row.original.urls[0].image) return null
      return (
        <Suspense>
          <Image
            src={
              row.original.urls[0].thumbnail ||
              "/images/placeholder_200x200.jpg"
            }
            width={200}
            height={200}
            alt="website thumbnail"
          />
        </Suspense>
      )
    },
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" type="Characters" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start gap-2">
          <Link
            href={`markup/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.title}
          </Link>
        </div>
      )
    },
  },

  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      if (row.original.budget === 0) return <span>FREE</span>
      return <span>{toCurrencyFormat(row.original.budget || 0)}</span>
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
      const deleteRow = trpc.job.myJob.delete.useMutation({
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
