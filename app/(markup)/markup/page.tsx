"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"
import { markupSchema } from "@/schema/markup.schema"

import { dashboardConfig } from "@/config/dashboard"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, Input, useForm } from "@/components/form-components"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-components/frm"
import { DashboardNav } from "@/components/navigation/nav"

interface JobsProps {}

const JobsPage: FC<JobsProps> = ({ className }: { className: string }) => {
  const form = useForm({
    schema: markupSchema,
    defaultValues: {
      url: "",
    },
  })

  return (
    <>
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={dashboardConfig.sidebarNav} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="">
          <Form
            form={form}
            className={cn("grid gap-6", className)}
            onSubmit={() => {}}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="max-w-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Go</Button>
          </Form>
        </div>
      </main>
    </>
  )
}

export default JobsPage
