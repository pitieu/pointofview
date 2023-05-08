"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "../ui/toast"

type ApiKeyModalProps = {
  refetch?: () => void
}

export const CreateApiKeyModal = function ({ refetch }: ApiKeyModalProps) {
  const [name, setName] = useState("")
  const { toast } = useToast()

  const createApiKey = trpc.apiKey.createAPIKey.useMutation({
    onSuccess: () => {
      toast({
        title: "API key created",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create API key",
        // description: error.message,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => createApiKey.mutate({ name })}
          >
            Try again
          </ToastAction>
        ),
      })
    },
    onSettled: async () => {
      if (refetch) refetch()
    },
  })

  return (
    <Dialog
      onOpenChange={() => {
        setName("")
      }}
    >
      <DialogTrigger asChild>
        <Button className="mt-2" disabled={createApiKey.isLoading}>
          Create new Api Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-semibold">Create Api Key</DialogHeader>
        <form>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Optional name"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={createApiKey.isLoading}
              className="bg-green-600 hover:bg-green-700"
              onClick={() => createApiKey.mutate({ name })}
            >
              Create Api Key
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
