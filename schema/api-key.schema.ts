import { TypeOf, z } from "zod"

export type CreateAPIKeyType = TypeOf<typeof createApiKeySchema>
export const createApiKeySchema = z.object({
  name: z.string().optional(),
})

export type UpdateAPIKeyType = TypeOf<typeof updateApiKeySchema>
export const updateApiKeySchema = z.object({
  name: z.string().optional(),
  apiKeyId: z.number(),
})

export type DeleteAPIKeyType = TypeOf<typeof updateApiKeySchema>
export const deleteApiKeySchema = z.object({
  apiKeyId: z.number(),
})
