import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai"
import { env } from "@/env.mjs"

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY as string,
})
export const openai = new OpenAIApi(configuration)

export const chatCompletion = async (
  messages: CreateChatCompletionRequest["messages"]
) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    })

    if (!response) return ""
    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      const text = response.data.choices[0].message.content.trim()

      return text
    } else {
      return ""
    }
  } catch (e: any) {
    console.log(e)
  }
}

export const openaiCompletion = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
  })
  return response.data.choices[0].text?.trim()
}
