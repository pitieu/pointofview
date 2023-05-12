import { createTRPCRouter } from "@/app/api/trpc/trpc-router"
import { apiKeyRouter } from "@/routers/api-key"
import { openaiRouter } from "@/routers/openai"
import { postRouter } from "@/routers/post"

export const appRouter = createTRPCRouter({
  apiKey: apiKeyRouter,
  openai: openaiRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
