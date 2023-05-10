import { TypeOf, z } from "zod"

export type PromptType = TypeOf<typeof promptSchema>
export const promptSchema = z.object({
  content: z.string(),
})
