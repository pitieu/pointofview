import { createTRPCRouter } from "@/app/api/trpc/trpc-router"
import { apiKeyRouter } from "@/routers/api-key"
import { openaiRouter } from "@/routers/openai"
import { postRouter } from "@/routers/post"
import { jobRouter } from "@/routers/job"

export const appRouter = createTRPCRouter({
  apiKey: apiKeyRouter,
  openai: openaiRouter,
  post: postRouter,
  job: jobRouter
})

export type AppRouter = typeof appRouter
