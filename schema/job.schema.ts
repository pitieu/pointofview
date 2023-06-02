import { urlPattern } from "@/utils/string"
import { TypeOf, z } from "zod"

export type JobSchemaType = TypeOf<typeof jobSchema>

const CustomUrl = z.string().refine((value) => urlPattern.test(value), {
  message: "Invalid URL. Make sure to include www. at the start of the url.",
})

export const jobSchema = z.object({
  title: z.string().min(5, "Title should have at least 5 characters"),
  budget: z.number().min(0).default(0).optional(),
  deadline: z.array(z.number().min(0).max(30)).optional(),
  published: z.boolean().default(false).optional(),
  description: z.string().optional(),
  urls: z
    .array(
      z.object({
        jobId: z.string().optional(),
        url: CustomUrl,
      })
    )
    .min(1),
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