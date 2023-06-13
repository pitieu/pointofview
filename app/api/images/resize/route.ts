import * as crypto from "crypto"
import { NextRequest } from "next/server"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { resizeImageFromUrl } from "@/lib/image"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const res = await req.json()
    const url = res.url
    const jobId = res.jobId
    if (env.WORKER_SECRET !== res.workerSecret) {
      return new Response("Unauthorized")
    }

    if (!url) throw new Error("URL is required")
    if (!jobId) throw new Error("JobId is required")

    const hash = crypto.createHash("sha256")
    hash.update(url)
    const urlId = hash.digest("hex")

    let imageToStore = await resizeImageFromUrl(url)

    await supabase.storage
      .from("images")
      .upload(`${urlId}_tiny`, imageToStore, {
        cacheControl: "3600",
        contentType: "image/jpeg",
      })

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`${urlId}_tiny`)

    await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        thumbnail: data.publicUrl,
      },
    })

    console.log("public url resized image", data.publicUrl)
    return new Response(
      JSON.stringify({
        success: 1,
        url: data.publicUrl,
      })
    )
  } catch (e) {
    console.log(e)
    return new Response("Something went wrong")
  }
}
