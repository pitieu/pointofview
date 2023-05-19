"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { userAccountSchema } from "@/schema/user.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Textarea } from "../ui/textarea"

interface UserAccountFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name" | "username" | "bio">
}

type FormData = z.infer<typeof userAccountSchema>

export function UserAccountForm({
  user,
  className,
  ...props
}: UserAccountFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAccountSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your name was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your Profile has been updated.",
    })

    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            <div className="flex-rows flex items-center">
              <Label htmlFor="username" className="w-1/6">
                Username
              </Label>
              <Input
                id="username"
                className="w-2/6"
                size={32}
                {...register("username")}
              />
              {errors?.username && (
                <p className="px-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex-rows flex items-center">
              <Label htmlFor="name" className="w-1/6">
                Name
              </Label>
              <Input
                id="name"
                className="w-2/6"
                size={32}
                {...register("name")}
              />
              {errors?.name && (
                <p className="px-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex-rows flex items-center">
              <Label htmlFor="bio" className="w-1/6 self-start">
                Bio
              </Label>
              <Textarea id="bio" className="w-2/6" {...register("bio")} />
              {errors?.bio && (
                <p className="px-1 text-xs text-red-600">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
