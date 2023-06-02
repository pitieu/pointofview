import { CreateCompletionRequest, CreateCompletionRequestPrompt } from "openai"

import { summarizeWebsite } from "@/lib/openai"

const MAX_WEB_TEXT_SIZE = 16000 // we use a max text size to prevent from calling OpenAi summarize too many times

/**
 * Normalizes a text by removing extra spaces.
 * @param text
 * @returns
 */
export const removeExtraSpaces = (text: string): string => {
  return text.replace(/\s+/g, " ")
}

/**
 * Chunks a text into smaller pieces.
 * @param text
 * @param chunkSize
 * @returns
 */
export const chunkText = (text: string, chunkSize: number): string[] => {
  if (text.length < chunkSize) return [text]
  const chunks: string[] = []
  let i = 0
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize))
    i += chunkSize
  }
  return chunks
}

// /**
//  * Splits into chunks and summarizes each chunk of text,
//  * then concatenates the results and returns the summarized text.
//  * @param text The text to summarize.
//  * @param maxChunkSize The maximum size of the input text.
//  * @param minOutputSize The minimum size of the output text.
//  * @returns The summarized text.
//  */

export const summarizeChunks = async (
  text: string,
  maxChunkSize: number,
  minOutputSize: number,
  summarizer: (
    prompt: CreateCompletionRequestPrompt
  ) => Promise<string | undefined> = summarizeWebsite
): Promise<string> => {
  if (!text) return ""
  if (text.length > MAX_WEB_TEXT_SIZE) text = text.slice(0, MAX_WEB_TEXT_SIZE)

  // Base case: If the input text is already small enough, return it as is.
  if (text.length <= minOutputSize) {
    return text
  }

  // If the input text is too large, chunk it and recursively summarize each chunk.
  // Added arbitrary 300 chars to make sure that the chunk size is not too small.
  if (text.length + 300 > maxChunkSize) {
    const chunks = chunkText(text, maxChunkSize)
    const summaries = await Promise.all(
      chunks.map(async (chunk) => await summarizer(chunk))
    )
    const summarizedText = summaries.join("")

    // Recursively summarize the summarized text.
    return await summarizeChunks(
      summarizedText,
      maxChunkSize,
      minOutputSize,
      summarizer
    )
  }

  // Otherwise, just summarize the input text.
  const summarized = await summarizer(text)
  if (!summarized) return ""
  return summarized
}

export const urlPattern = new RegExp(
  "^((https?:\\/\\/www\\.)|(www\\.))" + // protocol with www or just www
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?" + // port
    "(\\/[-a-z\\d%_.~+]*)*" + // path
    "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i" // fragment locator
)
