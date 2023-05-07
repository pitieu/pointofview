import { createTRPCRouter } from "@/app/api/trpc/trpc-router"
import { apiKeyRouter } from "@/routers/api-key"

export const appRouter = createTRPCRouter({
  apiKey: apiKeyRouter,
})

export type AppRouter = typeof appRouter
