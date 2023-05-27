"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { JobSchemaType, jobSchema } from "@/schema/job.schema"
import { Controller, useFieldArray } from "react-hook-form"

import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  Input,
  InputNumber,
  Slider,
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

import { Alert } from "../ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

interface AddJobFormProps extends React.HTMLAttributes<HTMLFormElement> {
  change: (data: JobSchemaType) => void
}

export function AddJobForm({ change, className, ...props }: AddJobFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const createJob = trpc.job.createJob.useMutation({
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
      urls: [{ jobId: "url-1", url: "" }],
      credentials: [],
      deadline: [0],
    },
  })

  form.watch((data: JobSchemaType) => change(data))

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray({
    control: form.control,
    name: "urls",
  })

  const {
    fields: credentialFields,
    append: appendCredential,
    remove: removeCredential,
  } = useFieldArray({
    control: form.control,
    name: "credentials",
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
              {/* deadline */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Deadline
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Icons.help
                            width={16}
                            height={16}
                            className="text-muted-foreground"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className=" text-sm text-muted-foreground">
                            This is the designated completion time for the job.
                            If the job isn't completed within the deadline, you
                            have the option to cancel and receive a full refund.
                            The countdown begins once the job is accepted.
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <div className="flex flex-row gap-6">
                      <FormDescription className="w-[100px]">
                        {field.value && field.value[0] > 0
                          ? `${field.value[0]} days`
                          : "No deadline"}
                      </FormDescription>
                      <FormControl>
                        <Slider
                          step={1}
                          max={30}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* URLS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Urls</CardTitle>
            <CardDescription>
              At least one url has to be given for a person to roast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <FormField
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Offer per url in USD
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Icons.help
                            width={16}
                            height={16}
                            className="text-muted-foreground"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className=" text-sm text-muted-foreground">
                            This is the max amount you are willing to offer per
                            page.
                          </div>
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
            <div className="mt-8 grid gap-4">
              {urlFields.map((field, index) => (
                <FormField
                  key={`url-${field.id}`}
                  name={`urls.${index}.url`}
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
                      <div className="relative flex w-full gap-2">
                        <FormLabel className="absolute left-2 top-[10px] text-sm text-muted-foreground">
                          http://
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={cn("max-w-xs pl-[60px]")}
                            placeholder="Url you want to be roasted"
                            {...frmField}
                          />
                        </FormControl>
                        {urlFields.length > 1 && (
                          <Button
                            type="button"
                            variant={"destructive"}
                            onClick={() => removeUrl(index)}
                          >
                            <Icons.trash width={16} height={16} />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {urlFields.length < 5 && (
              <Button
                type="button"
                variant="secondary"
                className="gap-1"
                onClick={() =>
                  appendUrl({ jobId: `url-${urlFields.length}`, url: "" })
                }
              >
                <Icons.add width={16} height={16} />
                Url
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* CREDENTIALS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Credentials (optional)
            </CardTitle>
            <CardDescription>
              If the user needs credentials to visit anywhere you can give him
              access through this.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant={"destructive"} className="mb-6 text-sm">
              Keep in mind these credentials will be accessible by the public so
              use dummy accounts.
            </Alert>
            <div className="grid gap-4">
              {credentialFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-row items-center gap-2"
                >
                  <FormField
                    name={`credentials.${index}.label`}
                    render={({ field: frmField }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Credentials Label {index + 1}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Admin credential"
                            {...frmField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`credentials.${index}.username`}
                    render={({ field: frmField }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Username {index + 1}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="Username"
                            {...frmField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`credentials.${index}.label`}
                    render={({ field: frmField }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Password {index + 1}
                        </FormLabel>
                        <FormControl>
                          <Input
                            name={`credentials.${index}.password` as const}
                            type="password"
                            autoComplete="new-password"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    className="mt-2"
                    variant={"destructive"}
                    onClick={() => removeCredential(index)}
                  >
                    <Icons.trash width={16} height={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {credentialFields.length < 21 && (
              <Button
                type="button"
                variant="secondary"
                className="gap-1"
                onClick={() =>
                  appendCredential({
                    id: `cred-${credentialFields.length}`,
                    label: "",
                    username: "",
                    password: "",
                  })
                }
              >
                <Icons.add width={16} height={16} /> Credentials
              </Button>
            )}
          </CardFooter>
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
