"use client";

import React, { useEffect, useRef, useState } from "react"
import { useToggle } from "@mantine/hooks"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Props {
  id: string
  host: string
}

const CommentSidebar: React.FC<Props> = ({ id, host }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const commentRef = useRef<HTMLInputElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const [navigationEnabled, toggleNavigation] = useToggle()
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const url = `http://${id}.p.${host}`

  useEffect(() => {
    window.addEventListener("message", function (event) {
      // check if it's coming from same host
      if (event.origin !== url || !event.data?.type) return

      console.log("Received message:", event.data)
    })
  }, [])

  const addComment = () => {
    const comment = commentRef.current
    const commentsDiv = commentsRef.current

    if (comment && commentsDiv && comment.value !== "") {
      const newComment = document.createElement("div")
      newComment.textContent = comment.value
      newComment.classList.add("border", "p-2", "my-2") // Tailwind CSS classes
      commentsDiv.appendChild(newComment)
      comment.value = ""
    }
  }

  const refreshIframe = () => {
    let iframeWindow = iframeRef?.current?.contentWindow
    if (iframeWindow) {
      iframeWindow.postMessage(
        { type: "preventNavigation", value: navigationEnabled },
        url
      )
      toggleNavigation()
    }
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-2 p-4">
        <div className="flex flex-row items-center">
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "desktop",
              "text-blue-500": mode === "desktop",
            })}
            onClick={() => setMode("desktop")}
          >
            <Monitor width={24} height={24} />
          </Button>
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "tablet",
              "text-blue-500": mode === "tablet",
            })}
            onClick={() => setMode("tablet")}
          >
            <Tablet width={24} height={24} />
          </Button>
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "mobile",
              "text-blue-500": mode === "mobile",
            })}
            onClick={() => setMode("mobile")}
          >
            <Smartphone width={24} height={24} />
          </Button>
        </div>
        <Button
          variant={"outline"}
          onClick={() => refreshIframe()}
          className=" ml-2 px-4 py-2 text-white"
        >
          {navigationEnabled ? "Disable" : "Enable"} Link Prevention
        </Button>
      </div>
      <div className="flex">
        <div className="w-1/3 border-r p-4">
          <div className="mb-4 flex flex-row gap-2">
            <input
              ref={commentRef}
              className="w-full flex-1 border p-2"
              type="text"
            />
            <button
              onClick={addComment}
              className=" bg-blue-500 px-4 py-2 text-white"
            >
              Send
            </button>
          </div>
          <div ref={commentsRef}>{/* Comments will be appended here */}</div>
        </div>
        <div
          className={cn(
            "flex w-2/3 items-center justify-center border-4 border-green-600 bg-slate-50",
            {
              // "": mode === "desktop",
              "": mode === "tablet" || mode === "mobile",
            }
          )}
        >
          <div
            className={cn("bg-white", {
              "h-screen w-full": mode === "desktop",
              "my-8 rounded-3xl border-2 border-gray-50 p-8 pt-24 shadow-md":
                mode === "tablet" || mode === "mobile",
            })}
          >
            <div
              className={cn("flex h-full w-full items-center justify-center", {
                "border-2 border-gray-50":
                  mode === "tablet" || mode === "mobile",
              })}
            >
              <iframe
                ref={iframeRef}
                sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox"
                src={`${url}/api/markup`}
                className={cn({
                  "h-screen w-full": mode === "desktop",
                  "h-[768px] w-[576px]": mode === "tablet",
                  "h-[667px] w-[375px]": mode === "mobile",
                })}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentSidebar