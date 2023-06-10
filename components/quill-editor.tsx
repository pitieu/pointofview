"use client"

import React, { useState } from "react"
import ReactQuill from "react-quill"

import "react-quill/dist/quill.snow.css"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

interface QuillEditorProps {
  onSave: (value: string) => void
  onClose: () => void
  visible?: boolean
  className?: string
  top: string
  left: string
  isLoading: boolean
}

const QuillEditor = React.forwardRef(
  (
    {
      onSave,
      visible,
      top,
      left,
      className,
      onClose,
      isLoading,
      ...props
    }: QuillEditorProps,
    ref
  ) => {
    const [value, setValue] = useState("")

    const modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    }

    return (
      <div
        style={{ top: top, left: visible ? left : "-1000px" }}
        className={cn(
          `absolute flex w-[400px] flex-col rounded-xl bg-white p-2 shadow-xl`
        )}
      >
        <ReactQuill
          // @ts-ignore
          // ref={ref}
          isLoading={isLoading}
          theme="snow"
          onChange={setValue}
          modules={modules}
          placeholder="Write your comment here..."
          className={"h-[200px] w-full border-t-0 border-gray-100"}
          {...props}
        />
        <div className="mt-[50px] flex justify-end gap-4">
          <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={() => onSave(value)}>
            Save
          </Button>
        </div>
      </div>
    )
  }
)

export { QuillEditor }
