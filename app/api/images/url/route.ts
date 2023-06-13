import * as crypto from "crypto"
import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { screenshotLocalUrl, screenshotOneUrl } from "@/lib/image"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_API_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
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

  let imageToStore: string
  if (env.SCREENSHOT_ENABLED == "local") {
    imageToStore = await screenshotLocalUrl(url)
  } else {
    imageToStore = await screenshotOneUrl(url)
  }

  await supabase.storage.from("images").upload(`${urlId}`, imageToStore, {
    cacheControl: "3600",
  })
  const { data } = supabase.storage.from("images").getPublicUrl(`${urlId}`)

  db.job.update({
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
