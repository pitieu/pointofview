import * as crypto from "crypto"
import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { resizeImageFromUrl } from "@/lib/image"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_API_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export const config = {
  api: {
    bodyParser: false,
  },
}

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

  let imageToStore: string = await resizeImageFromUrl(url)

  const result = await supabase.storage
    .from("images")
    .upload(`${urlId}_tiny`, imageToStore, {
      cacheControl: "3600",
    })

  const { data } = supabase.storage.from("images").getPublicUrl(`${urlId}`)

  db.job.update({
    where: {
      id: jobId,
    },
    data: {
      thumbnail: data.publicUrl,
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
