import { TypeOf, z } from "zod"

export type CreateAPIKeyType = TypeOf<typeof createApiKeySchema>
export const createApiKeySchema = z.object({
  name: z.string().min(1),
})
