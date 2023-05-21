import { JobSchemaType } from "@/schema/job.schema"
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
      deadline: input.deadline,
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

export async function getMyJobHandler({ ctx }: { ctx: Context }) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  const jobs = await db.job.findMany({
    where: {
      userId: userId,
    },
    include: {
      urls: true,
      credentials: true,
    },
  })

  return jobs
}
