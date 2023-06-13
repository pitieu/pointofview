import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { env } from "@/env.mjs"

const supabaseUrl = "https://wponzzunhfwetffursiz.supabase.co"
const supabaseKey = env.SUPABASE_API_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  //TODO: Remember to enforce type here and after use some lib like zod.js to check it
  const files = formData.getAll("image") as File[]

  const fileToStorage = files[0]

  const result = await supabase.storage
    .from("images")
    .upload(`${fileToStorage.name}`, fileToStorage, {
      cacheControl: "3600",
    })
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`${fileToStorage.name}`)

  console.log("public url image", data.publicUrl)
  return new Response(
    JSON.stringify({
      success: 1,
      file: {
        url: data.publicUrl,
      },
    })
  )
}
