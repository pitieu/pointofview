"use client"

import { useEffect, useState } from "react"
import { trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

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
import { Icons } from "../icons"
import { GeneralCombobox } from "../general-combobox"
import { postTypeSchema, postTypesType } from "@/schema/post.schema"
import { Textarea } from "../ui/textarea"

type GeneratePostModalProps = {
  refetch?: () => void
}
const postTypes = [
  {
    value: "product_reviews",
    label: "Product Reviews",
  },
  {
    value: "tutorials",
    label: "Tutorials",
  },
]

type FormData = z.infer<typeof postTypeSchema>

export const GeneratePostModal = function ({
  refetch,
}: GeneratePostModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(postTypeSchema),
    defaultValues: {
      product: "Vaseline® Healthy Bright UV Extra Brightening",
    },
  })

  const product = useWatch({
    control,
    name: "product",
  })

  useEffect(() => {
    register("postType")
    register("content")
    register("product")
    register("productDetails")
    register("title")
  }, [register])

  const [postType, setPostType] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const searchProductDetails = trpc.post.searchProductDetails.useMutation({
    onSuccess: (response) => {
      console.log("search result", response)
      setValue("productDetails", response)
    },
  })
  const generateAIPost = trpc.post.generateAIPost.useMutation({
    onSuccess: () => {
      console.log("content generated")
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to generate post",
        // description: error.message,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() =>
              handleSubmit((data: FormData) => {
                console.log(data)

                generateAIPost.mutate(data)
              })()
            }
          >
            Try again
          </ToastAction>
        ),
      })
    },
    onSettled: async () => {
      console.log("Completed")
    },
  })

  const generatePost = (data: FormData) => {
    generateAIPost.mutate(data)
  }
  const searchProductDetailsHandler = () => {
    console.log("Search product details")
    if (getValues("postType") === "product_reviews") {
      searchProductDetails.mutate({ product: getValues("product") })
    }
  }
  useEffect(() => {
    if (generateAIPost.isLoading || searchProductDetails.isLoading) {
      return setIsLoading(true)
    }
    setIsLoading(false)
  }, [generateAIPost.isLoading, searchProductDetails.isLoading])

  return (
    <Dialog
      onOpenChange={() => {
        setValue("title", "")
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Icons.robot width={25} height={25} className="mr-2" />
          Generate Post
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader className="font-semibold">AI generated Post</DialogHeader>
        <form
          className="grid grid-cols-1 gap-2"
          onSubmit={handleSubmit(generatePost)}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Post Type
            </label>
            <div className="col-span-3">
              <GeneralCombobox
                value={postType}
                setValue={(value: postTypesType) => {
                  setPostType(value)
                  setValue("postType", value)
                }}
                data={postTypes}
                searchPlaceholder="Search post type..."
                selectPlaceholder="Select post type..."
                notfoundText="No post type found"
              />
            </div>
          </div>

          {postType && postType === "product_reviews" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700"
              >
                Product
              </label>
              <Input
                disabled={isLoading}
                id="product"
                {...register("product")}
                className="col-span-3"
                placeholder="Product name"
              />
            </div>
          )}
          {postType && postType === "product_reviews" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="productDetails"
                className="mt-2 block self-start text-sm font-medium text-gray-700"
              >
                Product Details
              </label>
              <div className="col-span-3 flex flex-1">
                <Textarea
                  id="productDetails"
                  {...register("productDetails")}
                  className="min-h-[200px] flex-1"
                  placeholder="Product Details"
                  disabled={isLoading}
                />
                {postType && product && (
                  <Button
                    className="ml-3 self-start"
                    type="button"
                    onClick={searchProductDetailsHandler}
                    disabled={isLoading}
                  >
                    {searchProductDetails.isLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.robot width={25} height={25} />
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
          {postType && postType === "tutorials" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                id="title"
                {...register("title")}
                className="col-span-3"
                placeholder="Tutorial title"
              />
            </div>
          )}
        </form>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit(generatePost)}
            disabled={isLoading}
          >
            Generate Post
          </Button>
          {postType && content && (
            <DialogClose asChild>
              <Button type="button" className="bg-green-600 hover:bg-green-700">
                Save & Continue
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
