import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

import { promptHandler } from "@/trpc-api/openai.api"
import { promptSchema } from "@/schema/openai.schema"

export const openaiRouter = createTRPCRouter({
  prompt: protectedProcedure.input(promptSchema).query(promptHandler),
})
