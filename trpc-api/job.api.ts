import {
  AddCommentSchemaType,
  CommentSchemaType,
  FetchMyJobType,
  JobSchemaType,
} from "@/schema/job.schema"
import { TRPCError } from "@trpc/server"
import lodash from "lodash"

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
  let urls: UrlData[] = []

  if (env.SCREENSHOT_ENABLED == "false") {
    urls = input.urls.map((el) => {
      return {
        url: el.url,
        image:
          "09a8b930c8b79e7c313e5e741e1d59c39ae91bc1f10cdefa68b47bf77519be57.gif",
        thumbnail:
          "09a8b930c8b79e7c313e5e741e1d59c39ae91bc1f10cdefa68b47bf77519be57_tiny.gif",
      }
    })
  } else {
    // Todo: move this to a queue system
    for (const webUrl in input.urls) {
      try {
        const { url, thumbnail } = await createThumbnailFromUrl(
          "https://" + input?.urls[webUrl].url
        )
        urls.push({
          image: url,
          thumbnail: thumbnail,
          url: "https://" + input.urls[webUrl].url,
        })
      } catch (e) {
        console.log(e)
        console.log("failed url ", input.urls[webUrl].url)
        urls.push({ image: "", thumbnail: "", url: input.urls[webUrl].url })
      }
    }
  }

  // Todo: if it's publish call notifications?
  const job = await db.job.create({
    data: {
      title: input.title,
      published: input.published,
      budget: input.budget,
      deadline: (input.deadline && input.deadline[0]) || 0,
      description: input.description,
      urls: {
        create: urls,
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

  if (env.SCREENSHOT_ENABLED == "false") {
    console.log("don't delete test image")
  } else {
    // todo: delete images related to this job
  }
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

export async function fetchCommentsHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: FetchMyJobType
}) {
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })
  console.log(input.id)
  const job = await db.job.findUnique({
    where: {
      jobId: input.id,
    },
    include: {
      // urls: true,
      // credentials: true,
      comments: true,
    },
  })

  return job ? job : []
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

    const newPin = await db.commentPin.create({
      data: {
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

    const job = await db.jobComments.create({
      data: {
        comment: input.comment,
        jobId: input.jobId,
        pinId: newPin.id,
      },
    })
    console.log(job)

    return job
  } catch (e) {
    console.log(e)
    return ""
  }
}
