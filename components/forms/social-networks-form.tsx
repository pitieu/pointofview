"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { socialNetworkSchema } from "@/schema/user.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { SocialNetwork, User } from "@prisma/client"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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

interface SocialNetworksFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  userId: Pick<User, "id">
  socialNetworks: Pick<SocialNetwork, "id" | "name" | "url">[]
}

type FormData = z.infer<typeof socialNetworkSchema>

export function SocialNetworksForm({
  userId,
  socialNetworks,
  className,
  ...props
}: SocialNetworksFormProps) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(socialNetworkSchema),
  })
  const { fields, append, remove } = useFieldArray({
    name: "socialNetworks",
    control,
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    console.log(data)
    // const response = await fetch(`/api/users/${userId}/social-networks`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: data.id,
    //     url: data.url,
    //   }),
    // })

    setIsSaving(false)
  }

  function addRow() {
    console.log("addRow")
    append({ name: "", url: "" })
  }

  function deleteRow(index: number) {
    remove(index)
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Social Networks & Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {fields.map((network: SocialNetwork, i) => (
              <div key={i} className="flex flex-row items-center gap-4">
                <Input
                  {...register(`socialNetworks.${i}.id`)}
                  id={`name-${network.name}`}
                  defaultValue={network.id}
                  placeholder="Enter social network link"
                  className="w-3/6"
                />
                <Label
                  htmlFor={`name-${network.name}`}
                  className="sr-only w-1/6"
                >
                  {network.name || "Social Network"}
                </Label>
                <Input
                  {...register(`socialNetworks.${i}.url`)}
                  id={`name-${network.name}`}
                  defaultValue={network.url}
                  placeholder="Enter social network link"
                  className="w-3/6"
                />
                <Button
                  className=""
                  variant="destructive"
                  onClick={() => deleteRow(i)}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <Button onClick={addRow}>+ Add Social Network</Button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
          {JSON.stringify(errors?.socialNetworks)}
        </CardFooter>
      </Card>
    </form>
  )
}
