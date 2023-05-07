import * as z from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const apiKeyCreateSchema = z.object({
  name: z.string(),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    const { user } = session

    const json = await req.json()
    const body = apiKeyCreateSchema.parse(json)

    const apiKey = await db.apiKey.update({
      where: {
        userId: user.id,
      },
      data: {
        name: body.name,
      },
    })
    return new Response(JSON.stringify(apiKey), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    const { user } = session

    const json = await req.json()
    const body = apiKeyCreateSchema.parse(json)

    const apiKey = await db.apiKey.create({
      data: {
        name: body.name,
        userId: user.id,
      },
    })
    return new Response(JSON.stringify(apiKey), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
