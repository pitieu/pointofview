"use client"

import React, { useEffect, useRef, useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuillEditor } from "@/components/quill-editor"

interface Props {
  id: string
  host: string
  userId: string | null
}

type ScreenMode = "desktop" | "tablet" | "mobile"
type EditMode = "comment" | "browse"

interface Pin {
  index: string
  title?: string
  url: string
  xpath: string
  screenMode: ScreenMode
  oldBounds: any
  color?: string
  left: string
  top: string
  parentLeft: string
  parentTop: string
  ownerId: string
  pinDirection?: string
}

const CommentSidebar: React.FC<Props> = ({ id, host, userId }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [mode, setMode] = useState<ScreenMode>("desktop")
  const [editMode, setEditMode] = useState<EditMode>("comment")
  const [editorPosition, setEditorPosition] = useState({
    top: "0px",
    left: "-1000px",
    parentTop: "0px",
    parentLeft: "-1000px",
  })
  const [pins, setPins] = useState<Pin[]>([])
  const [isEditing, setIsEditing] = useState(true)
  const url = `http://${id}.p.${host}`

  // const {
  //   data: comments = [],
  //   isLoading,
  //   refetch,
  // } = trpc.job.comments.list.useQuery(
  //   {
  //     jobId: id,
  //   },
  //   { trpc: { abortOnUnmount: true } }
  // )

  const addComment = trpc.job.comments.add.useMutation({
    onSuccess: () => {
      sendMsgIframe({
        type: "addPin",
        pin: pins.at(-1), // get last element
      })
      setPins(() => [])
      setIsEditing(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    window.addEventListener("message", function (event) {
      // check if it's coming from same host
      if (event.origin !== url || !event.data?.type) return

      if (event.data.type === "add_pin") {
        const rect = iframeRef?.current?.getBoundingClientRect()
        if (!rect) return
        let positionTop =
          event.data.editor.parentTop + rect!.y - 32 + window.scrollY // pin = width + border = 32px
        let positionLeft =
          event.data.editor.parentLeft + rect!.x + 37 + window.scrollX
        let pinTop = event.data.pin.parentTop + rect!.y - 32 + window.scrollY
        let pinLeft = event.data.pin.parentLeft + rect!.x - 1 + window.scrollX
        let pinDirection = "bl"

        // positioning the pin
        if (pinLeft + 32 > rect.right) {
          pinLeft = pinLeft - 32
          pinDirection = "br"
        }
        if (pinTop + 40 > rect.top) {
          pinTop = pinTop + 32
          pinDirection = pinDirection == "br" ? "tr" : "tl"
        }
        if (pinTop + 40 > window.innerHeight) {
          pinTop = pinTop - 32
          pinDirection = pinDirection == "tr" ? "br" : "bl"
        }

        // positioning of the editor correctly
        if (positionLeft + 420 > rect.right) {
          positionLeft = positionLeft - 447 - 28
        }
        if (positionTop + 310 > window.innerHeight) {
          positionTop = positionTop - 310 + 32
        } else if (positionTop - 310 < rect.top) {
          positionTop = positionTop + 32
        }
        setPins([
          {
            index: event.data.pin.text,
            title: event.data.pin.title,
            xpath: event.data.xPath,
            oldBounds: event.data.pin.oldBounds,
            url: event.data.url,
            screenMode: event.data.screenMode,
            left: event.data.pin.left,
            top: event.data.pin.top,
            parentTop: Math.ceil(pinTop) + "px",
            parentLeft: Math.ceil(pinLeft) + "px",
            ownerId: userId,
            pinDirection: pinDirection,
          },
        ])

        setEditorPosition({
          top: event.data.pin.top,
          left: event.data.pin.left,
          parentTop: Math.ceil(positionTop) + "px",
          parentLeft: Math.ceil(positionLeft) + "px",
        })
        setIsEditing(true)
      }
      // console.log("Received message:", event.data)
      if (event.data.type === "url_changed") {
        sendMsgIframe({
          type: "data",
          screenMode: mode,
          editMode: editMode,
          user: {
            id: userId,
          },
          pins: pins,
          navigationEnabled: editMode === "browse",
        })
      }
    })
  }, [mode, editMode])

  const sendMsgIframe = (msg: any) => {
    let iframeWindow = iframeRef?.current?.contentWindow
    if (!iframeWindow) return false
    msg.app = "custom"
    console.log("sending", msg)
    iframeWindow.postMessage(msg, url)
    return true
  }

  const callEditMode = (mode: EditMode) => {
    if (mode !== editMode) {
      setEditMode(() => {
        sendMsgIframe({
          type: "navigationEnabled",
          navigationEnabled: mode === "browse",
        })
        return mode
      })
    }
  }
  const changeScreenMode = (newScreenMode: ScreenMode) => {
    if (newScreenMode !== mode) {
      setMode(() => {
        sendMsgIframe({
          type: "changeScreenMode",
          screenMode: newScreenMode,
        })
        return newScreenMode
      })
    }
  }

  const closeEditor = () => {
    setPins(() => [])
    sendMsgIframe({
      type: "closeEditor",
    })
    setIsEditing(false)
  }

  const saveEditor = (text: string) => {
    const pin = pins[0]

    addComment.mutate({
      comment: text,
      jobId: id,
      index: pin.index,
      title: pin.title,
      url: pin.url,
      xpath: pin.xpath,
      screenMode: pin.screenMode,
      oldBounds: JSON.stringify(pin.oldBounds),
      color: pin.color,
      left: pin.left,
      top: pin.top,
    })
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row items-center gap-2 p-4">
        <div className="flex flex-row items-center">
          {/* comments: {JSON.stringify(comments)} */}
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "desktop",
              "text-blue-500": mode === "desktop",
            })}
            onClick={() => changeScreenMode("desktop")}
            title="Desktop"
          >
            <Monitor width={24} height={24} />
          </Button>
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "tablet",
              "text-blue-500": mode === "tablet",
            })}
            onClick={() => changeScreenMode("tablet")}
            title="Tablet"
          >
            <Tablet width={24} height={24} />
          </Button>
          <Button
            variant={"ghost"}
            className={cn("px-2", {
              "hover:text-blue-700": mode === "mobile",
              "text-blue-500": mode === "mobile",
            })}
            onClick={() => changeScreenMode("mobile")}
            title="Mobile"
          >
            <Smartphone width={24} height={24} />
          </Button>
        </div>
        <div className="grid min-w-[200px] grid-cols-2 rounded-lg border-2 border-primary bg-slate-50">
          <Button
            variant={editMode === "browse" ? "ghost" : "default"}
            onClick={() => callEditMode("comment")}
            className={"w-full gap-1 px-4 py-2"}
            title="Click somewhere on the website to comment."
          >
            Comment
          </Button>
          <Button
            variant={editMode === "comment" ? "ghost" : "default"}
            onClick={() => callEditMode("browse")}
            className={"w-full gap-1 px-4 py-2"}
            title="Browse around the website"
          >
            Browse
          </Button>
        </div>
      </div>
      <div className="flex flex-grow">
        <Tabs defaultValue="Comments" className="w-[500px] border-r p-4">
          <div className="flex flex-1 items-center justify-center">
            <TabsList className="">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="comments">Comments</TabsContent>
          <TabsContent value="tasks">Tasks</TabsContent>
          <TabsContent value="info">Info</TabsContent>
        </Tabs>
        <div
          className={cn(
            "flex w-full items-center justify-center border-4 border-primary bg-slate-50"
          )}
        >
          <div
            className={cn("bg-white", {
              "h-full w-full": mode === "desktop",
              "my-8 rounded-3xl  p-8 pt-24 shadow-md":
                mode === "tablet" || mode === "mobile",
            })}
          >
            <div
              className={cn("flex h-full w-full items-center justify-center", {
                "border-2 border-gray-200":
                  mode === "tablet" || mode === "mobile",
              })}
            >
              <iframe
                ref={iframeRef}
                sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox"
                src={`${url}/api/markup`}
                className={cn({
                  "h-full w-full": mode === "desktop",
                  "h-[768px] w-[576px]": mode === "tablet",
                  "h-[667px] w-[375px]": mode === "mobile",
                })}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <QuillEditor
        visible={isEditing}
        isLoading={addComment.isLoading}
        onSave={(val) => saveEditor(val)}
        onClose={() => closeEditor()}
        top={editorPosition.parentTop}
        left={editorPosition.parentLeft}
      />
      {!!pins.length &&
        pins.map((pin, index) => (
          <div
            className={cn(
              "absolute flex h-8 w-8 justify-center rounded-full border-2 border-white bg-red-500 text-center font-sans font-semibold leading-7 text-white",
              {
                "rounded-bl-none": pin.pinDirection == "bl",
                "rounded-br-none": pin.pinDirection == "br",
                "rounded-tl-none": pin.pinDirection == "tl",
                "rounded-tr-none": pin.pinDirection == "tr",
              }
            )}
            key={index}
            style={{
              top: pin.parentTop,
              left: pin.parentLeft,
            }}
          >
            {pin.index}
          </div>
        ))}
    </div>
  )
}

export default CommentSidebar
