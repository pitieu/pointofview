import { TypeOf, z } from "zod"

export type CreatePostType = TypeOf<typeof createPostSchema>
export const createPostSchema = z.object({
  title: z.string().optional(),
})

export const postTypesList = z.enum(["tutorials", "product_reviews"])
export type postTypesType = z.infer<typeof postTypesList>

export type PostType = TypeOf<typeof postTypeSchema>
export const postTypeSchema = z.discriminatedUnion("postType", [
  z.object({
    postType: z.literal("product_reviews"),
    product: z.string(),
    productDetails: z.string().optional(),
    content: z.string().optional(),
  }),
  z.object({
    postType: z.literal("tutorials"),
    title: z.string(),
  }),
])

export type ProductType = TypeOf<typeof productSchema>
export const productSchema = z.object({
  product: z.string(),
})

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
  published: z.boolean().optional(),
})
