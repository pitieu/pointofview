import { TRPCError } from "@trpc/server"

import { db } from "@/lib/db"
import { Context } from "@/app/api/trpc/trpc-router"

export async function getSocialNetworks({ ctx }: { ctx: Context }) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const socialNetworks = await db.socialNetwork.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
  return socialNetworks
}
