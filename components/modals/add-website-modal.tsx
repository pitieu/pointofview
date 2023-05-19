"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type AddWebsiteModalProps = {
  refetch?: () => void
}
export const AddWebsiteModal = function ({ refetch }: AddWebsiteModalProps) {
  const [name, setName] = useState("")
  const { toast } = useToast()

  return (
    <Dialog
      onOpenChange={() => {
        setName("")
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-[150px] w-[150px] flex-col gap-4 rounded-lg border-2 border-gray-200"
        >
          <Icons.internet width={48} height={48} strokeWidth={1} />
          Website
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-semibold">Add Website</DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Homepage url
          </label>
          <Input
            id="name"
            value={name}
            className="col-span-3"
            placeholder="https://example.com"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="block text-sm font-medium text-gray-700">
            Verify Ownership
          </div>
          <div className="col-span-3">
            Download this file and upload it to `{name}/verify_url.txt` and then
            verify.
            <div>
              <Button variant="default"> Download File</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
