import { TypeOf, z } from "zod"

export type JobSchemaType = TypeOf<typeof jobSchema>

const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?" + // port
    "(\\/[-a-z\\d%_.~+]*)*" + // path
    "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i" // fragment locator
)

const CustomUrl = z.string().refine((value) => urlPattern.test(value), {
  message: "Invalid URL",
})

export const jobSchema = z.object({
  title: z.string().min(5, "Title should have at least 5 characters"),
  budget: z.number().min(0).default(0).optional(),
  deadline: z.number().min(0).default(0).optional(),
  published: z.boolean().default(false).optional(),
  description: z.string().optional(),
  urls: z
    .array(
      z.object({
        jobId: z.string(),
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
        password: z.string(),
      })
    )
    .optional(),
})
