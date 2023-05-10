import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { chatCompletion } from "@/lib/openai"
import { CreateChatCompletionRequest } from "openai"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const body = await req.json()
    // console.log(body.content)
    const content = [
      {
        role: "system",
        content:
          "You are an expert blog writer. You will only output text that is relevant to the blog post. You will only give one paragraph at a time.",
      },
      {
        role: "user",
        content:
          "I'd like to add a new paragraph to my blog post.\nHere's my current blog content, add a paragraph continuing the content.\n\nBlog Content:\n" +
          body.content.slice(-3000),
      },
    ]
    console.log(content)
    const result = await chatCompletion(
      content as CreateChatCompletionRequest["messages"]
    )
    console.log(result)
    return new Response(result, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
