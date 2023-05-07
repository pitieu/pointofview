import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createTRPCContext } from "@/app/api/trpc/trpc-router"

import { appRouter } from "@/lib/routes"
import { env } from "@/env.mjs"

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`)

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? (out) => {
            const { path, error } = out
            console.log("Path", path)
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            )
          }
        : undefined,
  })
}

export { handler as GET, handler as POST }
