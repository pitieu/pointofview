import { CreateAPIKeyType } from "@/schema/api-key.schema"
import { Context } from "@/app/api/trpc/trpc-router"
import { TRPCError } from "@trpc/server"
import { db } from "@/lib/db"

export async function getApiKeysHandler({ ctx }: { ctx: Context }) {
  console.log("getApiKeysHandler ctx.session", ctx.session)
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKeys = await db.apiKey.findMany({
    where: {
      userId: userId,
    },
  })

  return apiKeys
}

export async function createApiKeyHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: CreateAPIKeyType
}) {
  const { name } = input
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKey = await db.apiKey.create({
    data: {
      name: name,
      userId: userId,
    },
  })

  return apiKey
}

export async function updateApiKeyHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: CreateAPIKeyType
}) {
  const { name } = input
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKey = await db.apiKey.update({
    where: {
      userId: userId,
    },
    data: {
      name: name,
    },
  })

  return apiKey
}
