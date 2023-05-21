import { Column } from "@tanstack/react-table"
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronsUpDown,
  SortAsc,
  SortDesc,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  type?: "Characters" | "Default"
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  type = "Default",
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          type === "Default" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )
        ) : column.getIsSorted() === "asc" ? (
          type === "Default" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
