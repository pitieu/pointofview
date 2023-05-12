import * as cheerio from "cheerio"
import axios from "axios"
import { removeExtraSpaces, summarizeChunks } from "@/utils/string"

export const crawlUrl = async (url: string) => {
  console.log("Crawling url: ", url)
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  $("script, noscript").remove()
  const result = $("body").text()
  return result
}

export const crawlUrls = async (urls: string[]) => {
  const results = await Promise.all(urls.map((url) => crawlUrl(url)))
  return results
}

export const crawlAndSummarizeUrls = async ({
  urls,
  maxChunkSize = 3000,
  minOutputSize = 3000,
  summarizer,
}: {
  urls: string[]
  maxChunkSize?: number
  minOutputSize?: number
  summarizer?: (content: string) => Promise<string | undefined>
}) => {
  const results = await crawlUrls(urls)
  const normalizedText = removeExtraSpaces(results.join(" ")) // reduces the size of the text
  const summarizedText = await summarizeChunks(
    normalizedText,
    maxChunkSize,
    minOutputSize,
    summarizer
  )
  return summarizedText
}

/**
 * Crawls a url and returns the visible text summarized.
 * @param text The text to summarize.
 * @param maxChunkSize The maximum size of the input text.
 * @param minOutputSize The minimum size of the output text.
//  */
export const summarizeUrlText = async (
  url: string,
  maxChunkSize: number = 3000,
  minOutputSize: number = 3000
): Promise<string> => {
  try {
    const visibleText = await crawlUrl(url)
    const normalizedText = removeExtraSpaces(visibleText as string) // reduces the size of the text
    const summarizedText = await summarizeChunks(
      normalizedText,
      maxChunkSize,
      minOutputSize
    )
    return summarizedText
  } catch (e) {
    throw new Error("Error while crawling the url")
  }
}
