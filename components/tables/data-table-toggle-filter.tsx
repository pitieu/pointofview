import { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface DataTableToggleFilterProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  title: string
}

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function DataTableToggleFilter<TData, TValue>({
  table,
  title,
  className,
}: DataTableToggleFilterProps<TData, TValue>) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        id={`${title}-toggle` as const}
        defaultChecked={table?.getColumn(title)?.getIsVisible()}
        onCheckedChange={table?.getColumn(title)?.setFilterValue}
      />
      <Label htmlFor={`${title}-toggle` as const}>
        {capitalizeFirstLetter(title)}
      </Label>
    </div>
  )
}
