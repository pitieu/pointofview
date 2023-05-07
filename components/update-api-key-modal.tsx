"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Edit } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "./ui/toast"

type ApiKeyModalProps = {
  defaultName?: string
  apiKeyId?: number | undefined
  refetch?: () => void
}

export const UpdateApiKeyModal = function ({
  defaultName = "",
  apiKeyId = 0,
  refetch,
}: ApiKeyModalProps) {
  const [name, setName] = useState("")
  const { toast } = useToast()

  const editDialogChange = (state: boolean) => {
    if (state) setName(defaultName)
  }
  const updateApiKey = trpc.apiKey.updateAPIKey.useMutation({
    onSuccess: () => {
      console.log("success updateApiKey")
      toast({
        title: "Api Key name updated",
      })
    },
    onError(data) {
      toast({
        variant: "destructive",
        title: "Failed to update name",
        // description: error.message,
        action: (
          <ToastAction altText="Try again" onClick={callSave}>
            Try again
          </ToastAction>
        ),
      })
    },
    onSettled: async () => {
      if (refetch) refetch()
    },
  })

  const callSave = () => {
    if (apiKeyId === 0) return
    updateApiKey.mutate({
      name,
      apiKeyId: apiKeyId,
    })
  }

  return (
    <Dialog onOpenChange={editDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-2"
          disabled={updateApiKey.isLoading}
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-semibold">Edit Api Key</DialogHeader>
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
              disabled={updateApiKey.isLoading}
              className="bg-green-600 hover:bg-green-700"
              onClick={callSave}
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
