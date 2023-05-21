"use client"

import * as React from "react"
import { JobSchemaType, jobSchema } from "@/schema/job.schema"
import { Controller, useFieldArray } from "react-hook-form"

import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { useForm } from "@/hooks/use-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
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
import { Textarea } from "../ui/textarea"

interface AddJobFormProps extends React.HTMLAttributes<HTMLFormElement> {
  change: (data: JobSchemaType) => void
}

export function AddJobForm({ change, className, ...props }: AddJobFormProps) {
  const { toast } = useToast()

  const createJob = trpc.job.createJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Job created",
      })
    },
    onError: () => {
      toast({
        title: "Failed to create Job",
      })
    },
    onSettled: async () => {},
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm(jobSchema, {
    defaultValues: {
      title: "",
      urls: [{ jobId: "url-1", url: "" }],
      credentials: [{ id: "cred-1", label: "", username: "", password: "" }],
    },
  })

  watch((data: JobSchemaType) => change(data))

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray({
    control,
    name: "urls",
  })

  const {
    fields: credentialFields,
    append: appendCredential,
    remove: removeCredential,
  } = useFieldArray({
    control,
    name: "credentials",
  })

  async function onSubmit(data: JobSchemaType, publish: boolean) {
    console.log(publish, data) // print form data
    data.published = publish
    createJob.mutate(data)
  }

  function save() {
    handleSubmit((e) => onSubmit(e, true))
  }

  return (
    <form
      className={cn("grid gap-6", className)}
      onSubmit={handleSubmit((e) => onSubmit(e, true))}
      {...props}
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
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Example: Roast my new Pricing page."
                  className={cn(
                    "max-w-xs",
                    errors.title &&
                      "border-red-500 focus-visible:outline-red-500"
                  )}
                  {...register("title")}
                />
                <div className="text-xs text-red-500">
                  {errors?.title?.message}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="You can describe what you want to be done. Example: What can i improve in my landing page to get more conversions?"
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="deadline" className="flex items-center gap-2">
                  Deadline in Days
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
                        If left blank or set to 0 there will be no specified
                        deadline. <br />
                        <br />
                        This is the designated completion time for the job. If
                        the job isn't completed within the deadline, you have
                        the option to cancel and receive a full refund. The
                        countdown begins once the job is accepted.
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </Label>
                <div className="flex flex-row">
                  <Input
                    id="deadline"
                    type="number"
                    className="max-w-xs"
                    placeholder="Ex: 2"
                    {...register("deadline", {
                      setValueAs: (v) => parseInt(v || 0),
                    })}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  If left blank or set to 0 there will be no specified deadline.
                </div>
              </div>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
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
                </Label>
                <Input
                  id="budget"
                  className="max-w-xs"
                  placeholder="Ex: 1000"
                  type="number"
                  {...register("budget", {
                    // valueAsNumber: true,
                    setValueAs: (v) => parseInt(v || 0),
                  })}
                />
                <div className="text-sm text-muted-foreground">
                  You can leave it blank and have the community help you for
                  free.
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              {urlFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Label className="sr-only" htmlFor={`urls[${index}]`}>
                    Url {index + 1}
                  </Label>
                  <Controller
                    name={`urls.${index}.url` as const}
                    control={control}
                    defaultValue={field.url}
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
                    render={({ field }) => (
                      <div className="relative flex w-full gap-2">
                        <Label
                          htmlFor={`urls.${index}.url`}
                          className="absolute left-2 top-[10px] text-sm text-muted-foreground"
                        >
                          http://
                        </Label>
                        <Input
                          id={`urls.${index}.url`}
                          className={cn(
                            "max-w-xs pl-[60px]",
                            errors?.urls && errors.urls[index]
                              ? "border-red-500 focus-visible:outline-red-500"
                              : null
                          )}
                          placeholder="Url you want to be roasted"
                          {...field} // includes onChange, onBlur and value
                        />
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
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {urlFields.length < 21 && (
              <Button
                type="button"
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
                <div key={field.id} className="flex flex-row gap-2">
                  <Label
                    className="sr-only"
                    htmlFor={`credentials[${index}].label`}
                  >
                    Credentials {index + 1}
                  </Label>
                  <Input
                    {...register(`credentials.${index}.label` as const)}
                    defaultValue={field.label}
                    placeholder="Ex: Admin credential"
                  />
                  <Input
                    {...register(`credentials.${index}.username` as const)}
                    defaultValue={field.username}
                    // @ts-ignore
                    autocomplete="off"
                    placeholder="Username"
                  />
                  <Input
                    {...register(`credentials.${index}.password` as const)}
                    type="password"
                    // @ts-ignore
                    autocomplete="new-password"
                    defaultValue={field.password}
                    placeholder="Password"
                  />
                  <Button
                    type="button"
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
            onClick={handleSubmit((e) => onSubmit(e, false))}
          >
            Save Draft
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={handleSubmit((e) => onSubmit(e, true))}
          >
            Publish Job
          </Button>
        </div>
      </div>
    </form>
  )
}
