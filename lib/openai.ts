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
  console.log("openaiCompletion called with: ", prompt)
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1000,
  })
  console.log("Result: ", response.data.choices[0].text?.trim())
  return response.data.choices[0].text?.trim()
}

export const summarizeWebsite = async (
  content: string
): Promise<string | undefined> => {
  const prompt = `Please summarize the following website content, do not describe the general website, but instead concisely extract the specific information this sub page contains.: \n
            Website:\n${content}`

  return await openaiCompletion(prompt)
}

export const summarizeProduct = async (
  content: string,
  product: string
): Promise<string | undefined> => {
  const prompt = `Summarize the following content into a small paragraph, do not describe the general content, but instead concisely extract only information about this product "${product}" in this page and describe it as if it was a product description. Translate to english if necessary and summarize it. This is the content:\n\n${content} --- \n`
  return await openaiCompletion(prompt)
}

export const summarizeAndTranslate = async (
  content: string
): Promise<string | undefined> => {
  const prompt = `Translate the text below to english and describe it as if it was a product description:\n\n${content} --- \n`

  return await openaiCompletion(prompt)
}
