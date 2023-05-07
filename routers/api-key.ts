import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

import {
  createApiKeyHandler,
  updateApiKeyHandler,
  getApiKeysHandler,
  deleteApiKeyHandler,
} from "@/trpc-api/api-key.api"
import {
  createApiKeySchema,
  deleteApiKeySchema,
  updateApiKeySchema,
} from "@/schema/api-key.schema"

export const apiKeyRouter = createTRPCRouter({
  getAPIKeys: protectedProcedure.query(getApiKeysHandler),
  createAPIKey: protectedProcedure
    .input(createApiKeySchema)
    .mutation(createApiKeyHandler),
  updateAPIKey: protectedProcedure
    .input(updateApiKeySchema)
    .mutation(updateApiKeyHandler),
  deleteAPIKey: protectedProcedure
    .input(deleteApiKeySchema)
    .mutation(deleteApiKeyHandler),
})
