import fs from "fs";
import { PromptBananaType, PromptType } from "@/schema/openai.schema";
import * as banana from "@banana-dev/banana-dev";



import { openaiCompletion } from "@/lib/openai";
import { Context } from "@/app/api/trpc/trpc-router"

const apiKey = process.env.BANANA_API_KEY as string
const modelKey = process.env.BANANA_MODEL_KEY as string

export async function promptHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: PromptType
}) {
  const result = await openaiCompletion(input.content)
  return result
}

type ImageType = {
  id: string
  images: string[]
  message: string
  created_at: string
  apiVersion: string
  modelOutputs: any[]
}

export async function promptBananaHandler({
  ctx,
  input,
}: {
  ctx: Context
  input: PromptBananaType
}) {
  const { prompt } = input
  // console.log("promptBananaHandler", input)

  const modelParameters = {
    prompt: prompt,
    height: 768,
    width: 768,
    steps: 20,
    guidance_scale: 9,
    seed: undefined,
  }

  const out: ImageType = (await banana.run(
    apiKey,
    modelKey,
    modelParameters
  )) as ImageType
  console.log(JSON.stringify(out))

  const name = prompt.replace(/ /g, "_")

  fs.writeFileSync(
    `public/output/${name}.jpg`,
    out?.modelOutputs[0].image_base64,
    "base64"
  )
  return out
  // return ""
}