"use client"

import { FC } from "react"
import * as React from "react"
import { jobSchema } from "@/schema/job.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

import JobItem from "../job-item"
import { Alert } from "../ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Textarea } from "../ui/textarea"

interface AddJobFormProps extends React.HTMLAttributes<HTMLFormElement> {
  change: (data: FormData) => void
}

export type FormData = {
  title: string
  budget: number
  published: boolean
  deadline: string
  description: string
  urls: { id: string; value: string }[]
  credentials: {
    id: string
    label: string
    username: string
    password: string
  }[]
}

export function AddJobForm({ change, className, ...props }: AddJobFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      urls: [{ id: "url-1", value: "" }],
      credentials: [{ id: "cred-1", label: "", username: "", password: "" }],
    },
  })

  watch((data: FormData) => change(data))

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray<FormData, "urls", "id">({
    control,
    name: "urls",
  })

  const {
    fields: credentialFields,
    append: appendCredential,
    remove: removeCredential,
  } = useFieldArray<FormData, "credentials", "id">({
    control,
    name: "credentials",
  })

  async function onSubmit(data: FormData) {
    console.log(data) // print form data
  }

  const avgBudgetPerUrl = (budget: number, urlsLength: number) => {
    if (budget && urlsLength) {
      return Math.floor(budget / urlsLength)
    }
    return 0
  }

  return (
    <form
      className={cn("grid gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="grid gap-8">
        {JSON.stringify(errors.budget?.message)}
        <div className="block grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            className="max-w-xs"
            placeholder="Example: Roast my new Pricing page."
            {...register("title")}
          />
        </div>

        <div className="block grid gap-2">
          <Label htmlFor="title">Description</Label>
          <Textarea
            id="description"
            placeholder="You can describe what you want to be done. Example: What can i improve in my landing page to get more conversions?"
            {...register("description")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deadline">Deadline in Days</Label>
          <Input
            id="deadline"
            className="max-w-xs"
            placeholder="Ex: 2"
            {...register("deadline")}
          />
          <p className="text-sm text-muted-foreground">
            This is the time you want the job to be done. You can cancel after
            the deadline period and get a refund. The time starts when the job
            is accepted.
          </p>
        </div>

        {/* URLS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <CardDescription>
              Add which pages you want the person to process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Offer per Page in USD</Label>
                <Input
                  id="budget"
                  className="max-w-xs"
                  placeholder="Ex: 1000"
                  {...register("budget")}
                />
                <p className="text-sm text-muted-foreground">
                  This is the max value you are willing to offer per page.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              {urlFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Label className="sr-only" htmlFor={`urls[${index}]`}>
                    Url {index + 1}
                  </Label>
                  <Controller
                    name={`urls.${index}.value` as const}
                    control={control}
                    defaultValue={field.value}
                    rules={{
                      validate: (value) => {
                        try {
                          new URL(value)
                          return true
                        } catch (_) {
                          return "Invalid URL"
                        }
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        className="max-w-xs"
                        placeholder="Url you want to be roasted"
                        {...field} // includes onChange, onBlur and value
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => removeUrl(index)}
                  >
                    <Icons.trash width={16} height={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={() =>
                appendUrl({ id: `url-${urlFields.length}`, value: "" })
              }
            >
              <Icons.add width={16} height={16} />
              Url
            </Button>
          </CardFooter>
        </Card>

        {/* CREDENTIALS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Credentials</CardTitle>
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
                    placeholder="Label Ex: Admin credential"
                  />
                  <Input
                    {...register(`credentials.${index}.username` as const)}
                    defaultValue={field.username}
                    placeholder="Username"
                  />
                  <Input
                    {...register(`credentials.${index}.password` as const)}
                    type="password"
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
            <Button
              type="button"
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
          </CardFooter>
        </Card>
        <Button>Save Draft</Button>
        <Button type="submit">Publish Job</Button>
      </div>
    </form>
  )
}
