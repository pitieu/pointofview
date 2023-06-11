import {
  AddCommentSchemaType,
  CommentSchemaType,
  FetchMyJobType,
  JobSchemaType,
} from "@/schema/job.schema"
import { fixURL } from "@/utils/string"
import { TRPCError } from "@trpc/server"
import DOMPurify from "dompurify"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { createThumbnailFromUrl } from "@/lib/image"
import { Context } from "@/app/api/trpc/trpc-router"

type UrlData = {
  image: string
  thumbnail: string
  url: string
}

export async function createJobHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: JobSchemaType
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

  let url: UrlData = { image: "", thumbnail: "", url: fixURL(input.url) }

  // Todo: move this to a queue system and images to external s3 bucket maybe
  try {
    const result = await createThumbnailFromUrl(url.url)
    url = {
      image: result.url,
      thumbnail: result.thumbnail,
      url: url.url,
    }
  } catch (e) {
    console.log(e)
    console.log("failed url ", url.url)
  }

  // Todo: if it's publish call notifications?
  const job = await db.job.create({
    data: {
      title: input.title,
      published: input.published,
      budget: input.budget,
      deadline: 2,
      description: input.description,
      url: url.url,
      thumbnail: url.thumbnail,
      image: url.image,
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

  let where = {
    userId: userId,
  }

  if (input?.published || input?.published === false) {
    where["published"] = input.published
  }

  const jobs = await db.job.findMany({
    where: where,
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

  if (env.SCREENSHOT_ENABLED == "false") {
    console.log("don't delete test image")
  } else {
    // todo: delete images related to this job
  }
  try {
    // Begin a transaction
    await db.$transaction([
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

export async function fetchCommentsHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: FetchMyJobType
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })
  const job = await db.jobComments.findMany({
    where: {
      jobId: input.id,
    },
    include: {
      pin: true,
    },
  })

  return job
}

export async function addCommentHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: AddCommentSchemaType
}) {
  try {
    const userId = ctx.session?.user.id as string
    if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })

    const job = await db.jobComments.create({
      data: {
        // Todo: maybe white list only tags we use ?
        comment: DOMPurify.sanitize(input.comment),
        jobId: input.jobId,
        index: input.index,
        title: input.title,
        url: input.url,
        xpath: input.xpath,
        screenMode: input.screenMode,
        oldBounds: input.oldBounds,
        color: input.color,
        left: input.left,
        top: input.top,
        ownerId: userId,
      },
    })

    return job
  } catch (e) {
    console.log(e)
    return ""
  }
}
