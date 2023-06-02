"use client"

import React, { useEffect, useRef, useState } from "react"

interface Props {}

const CommentSidebar: React.FC<Props> = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const commentRef = useRef<HTMLInputElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const [iframeUrl, setIframeUrl] = useState("")
  const [preventNavigation, setPreventNavigation] = useState(false)

  useEffect(() => {
    const iframe = iframeRef.current

    if (iframe) {
      iframe.addEventListener("load", function () {
        const innerDoc = iframe.contentDocument
          ? iframe.contentDocument
          : iframe.contentWindow?.document

        if (innerDoc) {
          const overlay = innerDoc.createElement("div")
          overlay.style.position = "absolute"
          overlay.style.outline = "1px dotted rgba(255, 0, 0, 0.5)" // semi-transparent red
          overlay.style.pointerEvents = "none" // allows mouse events to pass through to elements below
          innerDoc.body.appendChild(overlay)

          innerDoc.body.addEventListener("mouseover", function (event) {
            // const targetElement = event.target as HTMLElement
            // targetElement.style.outline = "1px dotted red"
            const targetElement = event.target as HTMLElement

            // Position the overlay to cover the target element
            const rect = targetElement.getBoundingClientRect()
            const scrollTop =
              innerDoc.documentElement.scrollTop || innerDoc.body.scrollTop
            const scrollLeft =
              innerDoc.documentElement.scrollLeft || innerDoc.body.scrollLeft

            overlay.style.top = `${rect.top + scrollTop}px`
            overlay.style.left = `${rect.left + scrollLeft}px`
            overlay.style.width = `${rect.width}px`
            overlay.style.height = `${rect.height}px`
          })

          innerDoc.body.addEventListener("mouseout", function (event) {
            // const targetElement = event.target as HTMLElement
            // targetElement.style.outline = ""
            // Hide the overlay
            overlay.style.width = "0"
            overlay.style.height = "0"
          })
          // prevent a link navigation
          innerDoc.body.addEventListener("click", function (event) {
            console.log(preventNavigation)
            if (preventNavigation) {
              event.preventDefault()
            }
          })
        }
      })

      window.addEventListener("message", function (event) {
        if (event.data && event.data.url) {
          setIframeUrl(event.data.url)
          console.log(event.data.url)
        }
      })
    }
  }, [preventNavigation])

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

  return (
    <div>
      <div className="p-4">
        {" "}
        <button
          onClick={() => setPreventNavigation((prev) => !prev)}
          className=" ml-2 px-4 py-2 text-white"
          style={{ backgroundColor: preventNavigation ? "green" : "red" }}
        >
          {preventNavigation ? "Disable" : "Enable"} Link Prevention
        </button>{" "}
        {preventNavigation ? "Allowed Navigation" : "Not allowed Navigation"}
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
        <div className="w-2/3">
          <iframe
            ref={iframeRef}
            src={`http://asda.localhost:3000/api/markup/asda/adasd`}
            className="h-screen w-full"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default CommentSidebar
