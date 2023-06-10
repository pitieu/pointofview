import { urlPattern } from "@/utils/string"
import { TypeOf, z } from "zod"

export type JobSchemaType = TypeOf<typeof jobSchema>

const CustomUrl = z.string().refine((value) => urlPattern.test(value), {
  message: "Invalid URL. Make sure to include www. at the start of the url.",
})

export const jobSchema = z.object({
  title: z.string().min(3, "Title should have at least 3 characters"),
  budget: z.number().min(0).default(0).optional(),
  deadline: z.array(z.number().min(0).max(30)).optional(),
  published: z.boolean().default(false).optional(),
  description: z
    .string()
    .min(20, "Write a small description of what you want to achieve."),
  url: CustomUrl,
  credentials: z
    .array(
      z.object({
        id: z.string().optional(),
        label: z.string().optional().default("No Label"),
        username: z.string(),
        password: z.string().optional(),
      })
    )
    .optional(),
})

export type FetchMyJobType = TypeOf<typeof fetchMyJobSchema>

export const fetchMyJobSchema = z.object({
  id: z.string(),
})

export type CommentSchemaType = TypeOf<typeof jobCommentSchema>

export const jobCommentSchema = z.object({
  id: z.string().optional(),
  index: z.string(),
  title: z.string(),
  url: z.string(),
  xpath: z.string(),
  screenMode: z.enum(["desktop", "tablet", "mobile"]),
  oldBounds: z.string(),
  color: z.string().optional(),
  left: z.string(),
  top: z.string(),
  ownerId: z.string().optional(),
  pinDirection: z.string().optional(),

  comment: z.string(),
  jobId: z.string().optional(),
})

export type AddCommentSchemaType = TypeOf<typeof addJobCommentSchema>
export const addJobCommentSchema = z.object({
  index: z.string(),
  title: z.string().optional(),
  url: z.string(),
  xpath: z.string(),
  screenMode: z.enum(["desktop", "tablet", "mobile"]),
  oldBounds: z.string(),
  color: z.string().optional(),
  left: z.string(),
  top: z.string(),

  comment: z.string(),
  jobId: z.string(),
})
