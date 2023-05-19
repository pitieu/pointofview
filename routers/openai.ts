import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/app/api/trpc/trpc-router"

import { promptHandler, promptBananaHandler } from "@/trpc-api/openai.api"
import { promptSchema, promptBananaSchema } from "@/schema/openai.schema"

export const openaiRouter = createTRPCRouter({
  prompt: protectedProcedure.input(promptSchema).query(promptHandler),
  promptBanana: protectedProcedure
    .input(promptBananaSchema)
    .mutation(promptBananaHandler),
})
