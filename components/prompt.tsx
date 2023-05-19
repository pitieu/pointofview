"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"
import Image from "next/image"

export default function Prompt() {
  const [prompt, setPrompt] = useState(
    "a beautiful girl with blonde hair and blue eyes"
  )
  const [image, setImage] = useState("")

  const openai = trpc.openai.promptBanana.useMutation({
    onSuccess: (data) => {
      console.log("data", data)
      setImage(`/output/${prompt.replace(/ /g, "_")}.jpg`)
    },
    onError: (error) => {
      console.log("error", error)
    },
  })
  const generateImage = async () => {
    console.log("generateImage")
    openai.mutate({ prompt })
  }

  return (
    <div className="w-full">
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button onClick={generateImage}>Generate</Button>
      {image && (
        <div className="w-full">
          Image:
          <Image
            src={image}
            width={768}
            height={768}
            alt="generated image"
            className="rounded-md border"
          />
        </div>
      )}
    </div>
  )
}
