import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

import {
  createApiKeyHandler,
  updateApiKeyHandler,
  getApiKeysHandler,
} from "@/trpc-api/api-key.api"
import { createApiKeySchema } from "@/schema/api-key.schema"

export const apiKeyRouter = createTRPCRouter({
  getAPIKeys: protectedProcedure
    .input(createApiKeySchema)
    .query(getApiKeysHandler),
  createAPIKey: protectedProcedure
    .input(createApiKeySchema)
    .query(createApiKeyHandler),
  updateAPIKey: protectedProcedure
    .input(createApiKeySchema)
    .query(updateApiKeyHandler),
})
