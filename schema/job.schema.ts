import * as z from "zod"

export const jobSchema = z.object({
  title: z.string(),
  budget: z.number(),
  urls: z.array(
    z.object({
      id: z.string(),
      value: z.string().url(),
    })
  ),
  credentials: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      username: z.string(),
      password: z.string(),
    })
  ),
})
