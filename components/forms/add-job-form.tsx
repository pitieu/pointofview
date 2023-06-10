"use client"

import * as React from "react"
import { jobSchema } from "@/schema/job.schema"

import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  Input,
  InputNumber,
  Textarea,
  useForm,
} from "@/components/form-components"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-components/frm"
import { Icons } from "@/components/icons"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

interface AddJobFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function AddJobForm({ className, ...props }: AddJobFormProps) {
  const { toast } = useToast()

  const createJob = trpc.job.add.useMutation({
    onSuccess: () => {
      // router.refresh()
      // router.push(`/dashboard/my-jobs`)
    },
    onError: () => {
      toast({
        title: "Failed to create Job. Try again later.",
      })
    },
    onSettled: async () => {},
  })

  const form = useForm({
    schema: jobSchema,
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const onSubmit = (publish: boolean) => {
    const data = form.getValues()
    console.log(publish, data)
    data.published = publish
    createJob.mutate(data)
  }

  return (
    <Form
      form={form}
      className={cn("grid gap-6", className)}
      onSubmit={() => onSubmit(true)}
    >
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Job Information
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              <FormField
                name={`url`}
                rules={{
                  validate: (url) => {
                    try {
                      new URL(url)
                      return true
                    } catch (_) {
                      return "Invalid URL"
                    }
                  },
                }}
                render={({ field: frmField }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Website URL
                    </FormLabel>
                    <div className="relative flex w-full gap-2">
                      <FormControl>
                        <Input
                          className={cn("max-w-xs ")}
                          placeholder="Website you want to be reviewed"
                          {...frmField}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Example: Roast my new Pricing page."
                        className="max-w-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You can describe what you want to be done. Example: What can i improve in my landing page to get more conversions?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      What you offer (optional)
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Icons.help
                            width={16}
                            height={16}
                            className="text-muted-foreground"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="mt-2 text-sm text-muted-foreground">
                            If someone accepts this job and it has an offer
                            greater than 0$. They will have a 48h deadline, you
                            can ask for a refund if they didn't give you the
                            review by that time.
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <InputNumber
                        className="max-w-xs"
                        placeholder="Ex: 1000"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      You can leave it blank and have the community help you for
                      free.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onSubmit(false)}
            disabled={createJob.isLoading}
          >
            Save Draft
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={createJob.isLoading}
          >
            Publish Job
          </Button>
        </div>
      </div>
    </Form>
  )
}
