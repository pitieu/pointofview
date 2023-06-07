"use client"

import React, { useEffect, useRef, useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { QuillEditor } from "@/components/quill-editor"

interface Props {
  id: string
  host: string
}

interface Pin {
  index: string
  title?: string
  url: string
  xpath: string
  screenMode: string
  color?: string
  left: string
  top: string
  windowWidth: string
  windowHeight: string
  parentLeft: string
  parentTop: string
  ownerId: string
  pinDirection?: string
}

const CommentSidebar: React.FC<Props> = ({ id, host }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const commentRef = useRef<HTMLInputElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [editMode, setEditMode] = useState<"comment" | "browse">("comment")
  const [editorPosition, setEditorPosition] = useState({
    top: "0px",
    left: "-1000px",
    parentTop: "0px",
    parentLeft: "-1000px",
  })
  const [pins, setPins] = useState<Pin[]>([])
  const [isEditing, setIsEditing] = useState(true)
  const [editorContent, setEditorContent] = useState("")
  const url = `http://${id}.p.${host}`

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
            windowWidth: event.data.pin.windowWidth,
            windowHeight: event.data.pin.windowHeight,
            url: event.data.url,
            screenMode: event.data.screenMode,
            left: event.data.pin.left,
            top: event.data.pin.top,
            parentTop: Math.ceil(pinTop) + "px",
            parentLeft: Math.ceil(pinLeft) + "px",
            ownerId: event.data.ownerId,
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
            id: "1",
          },
          pins: pins,
          navigationEnabled: editMode === "browse",
        })
      }
    })
  }, [mode, editMode])

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

  const sendMsgIframe = (msg) => {
    let iframeWindow = iframeRef?.current?.contentWindow
    if (!iframeWindow) return false
    msg.app = "custom"
    console.log("sending", msg)
    iframeWindow.postMessage(msg, url)
    return true
  }

  const callEditMode = (mode) => {
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
  const changeScreenMode = (newScreenMode) => {
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

  const saveEditor = (text) => {
    setEditorContent(text)
    sendMsgIframe({
      type: "addPin",
      pin: pins[0],
    })
    setPins(() => [])
    setIsEditing(false)
  }

  const pin = () => {
    return
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row items-center gap-2 p-4">
        <div className="flex flex-row items-center">
          {mode}
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
            "flex w-2/3 items-center justify-center border-4 border-primary bg-slate-50"
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
        onSave={(val) => saveEditor(val)}
        onClose={() => closeEditor()}
        top={editorPosition.parentTop}
        left={editorPosition.parentLeft}
      />
      {!!pins.length &&
        pins.map((pin, index) => (
          // border-radius: 50% 50% 50% 0px;
          // background-color: blue;
          // border: 2px solid white;
          // font-weight: bold;
          // color: white;
          // line-height: 30px;
          // user-select: none;
          // z-index: 1000;
          // left: 80px;
          // top: 50px;
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
