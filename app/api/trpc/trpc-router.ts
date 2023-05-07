import { inferAsyncReturnType } from "@trpc/server"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import { db } from "@/lib/db"
import { ZodError } from "zod"
import { getServerAuthSession } from "@/lib/auth"
import { ServerResponse } from "http"

const createInnerTRPCContext = (opts) => {
  return {
    session: opts.session,
    db,
  }
}
/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async ({ req }) => {
  // get server session here
  const res = new ServerResponse(req)
  // const session = null
  const session = await getServerAuthSession({
    req: req,
    res: res,
  })

  // console.log("createTRPCContext session:", session)
  return createInnerTRPCContext({
    session,
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  console.log("#1#############################")
  console.log("enforceUserIsAuthed CTX:", ctx.session)
  // console.log("#1#############################")

  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

export type Context = inferAsyncReturnType<typeof createTRPCContext>
