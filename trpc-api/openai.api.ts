import { openaiCompletion } from "@/lib/openai"
import { Context } from "@/app/api/trpc/trpc-router"
import { TRPCError } from "@trpc/server"
import { PromptType } from "@/schema/openai.schema"

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
