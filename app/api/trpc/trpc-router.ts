import { inferAsyncReturnType } from "@trpc/server"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import { db } from "@/lib/db"
import { ZodError } from "zod"
import { getServerAuthSession } from "@/lib/auth"
import { ServerResponse } from "http"
import { type Session } from "next-auth"

type CreateContextOptions = {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
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
  const session = await getServerAuthSession({
    req: req,
    res: res,
  })

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
