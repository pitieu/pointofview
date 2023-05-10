import { createTRPCRouter } from "@/app/api/trpc/trpc-router"
import { apiKeyRouter } from "@/routers/api-key"
import { openaiRouter } from "@/routers/openai"

export const appRouter = createTRPCRouter({
  apiKey: apiKeyRouter,
  openai: openaiRouter,
})

export type AppRouter = typeof appRouter
