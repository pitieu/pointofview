"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "../data-table-pagination"
import { DataTableToggleFilter } from "../data-table-toggle-filter"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    refetch: () => void
  }
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: Boolean
  refetch?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  refetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "published", value: true },
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      refetch: refetch || (() => {}),
    },
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter by title..."
          value={(table?.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableToggleFilter table={table} title="published" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {isLoading ? (
                  table.getAllColumns().map((column) => {
                    return (
                      <TableCell key={`skeleton-${column.id}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    )
                  })
                ) : (
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="my-4" />
    </div>
  )
}
