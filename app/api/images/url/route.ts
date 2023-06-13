import * as crypto from "crypto"
import { NextRequest } from "next/server"
import {supabase} from "@/lib/supabase"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { screenshotLocalUrl, screenshotOneUrl } from "@/lib/image"

export async function POST(req: NextRequest) {
  const res = await req.json()
  const url = res.url
  const jobId = res.jobId

  console.log(env.WORKER_SECRET, res.workerSecret)
  if (env.WORKER_SECRET !== res.workerSecret) {
    return new Response("Unauthorized")
  }

  if (!url) throw new Error("URL is required")
  if (!jobId) throw new Error("JobId is required")

  const hash = crypto.createHash("sha256")
  hash.update(url)
  const urlId = hash.digest("hex")

  let imageToStore
  if (env.SCREENSHOT_ENABLED == "local") {
    imageToStore = await screenshotLocalUrl(url)
    imageToStore = Buffer.from(imageToStore, "base64")
  } else {
    imageToStore = await screenshotOneUrl(url)
    imageToStore = Buffer.from(imageToStore, "base64")
  }

  const result = await supabase.storage
    .from("images")
    .upload(`${urlId}`, imageToStore, {
      cacheControl: "3600",
      contentType: "image/jpeg",
    })
  const { data } = supabase.storage.from("images").getPublicUrl(`${urlId}`)

  const update = await db.job.update({
    where: {
      id: jobId,
    },
    data: {
      image: data.publicUrl,
    },
  })

  console.log("public url image", data.publicUrl)
  return new Response(
    JSON.stringify({
      success: 1,
      url: data.publicUrl,
    })
  )
}
