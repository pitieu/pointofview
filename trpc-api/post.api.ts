import { PostType, ProductType } from "@/schema/post.schema"
import { Context } from "@/app/api/trpc/trpc-router"
import { TRPCError } from "@trpc/server"
import {
  chatCompletion,
  summarizeAndTranslate,
  summarizeProduct,
} from "@/lib/openai"
import { CreateChatCompletionRequest } from "openai"
import { Url, search } from "@/lib/bing"
import { crawlAndSummarizeUrls, crawlUrl } from "@/lib/crawler"

export async function generateAIPostHandler({
  input,
  ctx,
}: {
  input: PostType
  ctx: Context
}) {
  console.log("generateAIPostHandler called")
  const userId = ctx.session?.user.id as string
  if (!userId) throw new TRPCError({ code: "BAD_REQUEST" })
  console.log(input)
  const content = [
    {
      role: "system",
      content:
        "You are an expert blog writer. You will only output text that is relevant to the blog post. You will only give one paragraph at a time.",
    },
    {
      role: "user",
      content:
        "I'd like to add a new paragraph to my blog post.\nHere's my current blog content, add a paragraph continuing the content.\n\nBlog Content:\n",
    },
  ]
  // const result = await chatCompletion(
  //   content as CreateChatCompletionRequest["messages"]
  // )
  return "Ok"
}

export async function searchProductDetailsHandler({
  input,
  ctx,
}: {
  input: ProductType
  ctx: Context
}) {
  try {
    console.log("searchProductDetailsHandler called")
    console.log(input)

    // const urls = await search(input.product, 1)
    const model = {
      max_tokens: 500,
      model: "text-ada-001",
    }
    const result = await crawlAndSummarizeUrls({
      urls: [], //urls.map((url: Url) => url.url),
      summarizer: (str) => summarizeProduct(str, input.product, model),
      maxChunkSize: 17000,
    })
    // cleanup by summarizing and translating could be avoided maybe if previous summarization was more efficient.
    const summarized = await summarizeAndTranslate(result, model)

    console.log("SUMMARIZED RESULT :", summarized)
    return summarized
  } catch (e) {
    console.log(e)
  }
}
