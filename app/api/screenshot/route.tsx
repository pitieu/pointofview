"use server"

import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { createThumbnailFromUrl } from "@/lib/image"

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url")
    if (!url) throw Error("No url provided")

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    if (!session.user.id) throw Error("No user id")

    const result = await createThumbnailFromUrl(url)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.log("error")
    console.log(error)
  }
}
