import { FetchMyJobType, JobSchemaType } from "@/schema/job.schema"
import { TRPCError } from "@trpc/server"
import lodash from "lodash"

import { db } from "@/lib/db"
import { Context } from "@/app/api/trpc/trpc-router"

export async function createJobHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: JobSchemaType
}) {
  console.log("createJobHandler")
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  // Todo: if it's publish call notifications?
  const job = await db.job.create({
    data: {
      title: input.title,
      published: input.published,
      budget: input.budget,
      deadline: (input.deadline && input.deadline[0]) || 0,
      description: input.description,
      urls: {
        create: input.urls.map((el) => {
          return { url: el.url }
        }),
      },
      credentials: {
        create: input.credentials?.map((el) => {
          return lodash.pick(el, ["label", "username", "password"])
        }),
      },
      userId: userId,
    },
  })

  return job
}

export async function listMyJobHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: { published?: boolean }
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  console.log("input", input)

  let where = {
    userId: userId,
  }

  if (input?.published || input?.published === false) {
    where["published"] = input.published
  }

  const jobs = await db.job.findMany({
    where: where,
    include: {
      urls: true,
      credentials: true,
    },
  })

  return jobs
}

export async function fetchMyJobHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: FetchMyJobType
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const job = await db.job.findUnique({
    where: {
      id: input.id,
    },
    include: {
      urls: true,
      credentials: true,
    },
  })

  return job
}

export async function deleteMyJobHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: FetchMyJobType
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  try {
    // Begin a transaction
    await db.$transaction([
      db.jobUrl.deleteMany({
        where: {
          jobId: input.id,
        },
      }),
      db.jobCredentials.deleteMany({
        where: {
          jobId: input.id,
        },
      }),
      db.job.deleteMany({
        where: {
          id: input.id,
          userId: userId,
        },
      }),
    ])
  } catch (error) {
    console.log(error)
    throw error
  }

  return "Success"
}
