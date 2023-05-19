import { TypeOf, z } from "zod"

export type PromptType = TypeOf<typeof promptSchema>
export const promptSchema = z.object({
  content: z.string(),
})

export type PromptBananaType = TypeOf<typeof promptBananaSchema>
export const promptBananaSchema = z.object({
  prompt: z.string(),
})
