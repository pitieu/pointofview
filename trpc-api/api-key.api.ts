import {
  CreateAPIKeyType,
  UpdateAPIKeyType,
  DeleteAPIKeyType,
} from "@/schema/api-key.schema"
import { Context } from "@/app/api/trpc/trpc-router"
import { TRPCError } from "@trpc/server"
import { db } from "@/lib/db"
import { ApiKey } from "@prisma/client"

export async function getApiKeysHandler({ ctx }: { ctx: Context }) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKeys = await db.apiKey.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
  const mappedKeys = apiKeys.map((apiKey: ApiKey) => {
    apiKey.key = apiKey.key.slice(0, 3) + "..." + apiKey.key.slice(-4)
    return apiKey
  })
  return mappedKeys
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
      name: name || "Secret Key",
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
  input: UpdateAPIKeyType
}) {
  const { name, apiKeyId } = input
  const userId = ctx.session.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKey = await db.apiKey.update({
    where: {
      id: apiKeyId,
    },
    data: {
      name: name,
    },
  })

  return apiKey
}

export async function deleteApiKeyHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: DeleteAPIKeyType
}) {
  const { apiKeyId } = input
  const userId = ctx.session.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const apiKey = await db.apiKey.deleteMany({
    where: {
      id: apiKeyId,
      userId: userId,
    },
  })

  return apiKey
}
