"use server"
import { env } from "@/env.mjs"

export interface CrawlResult {
  name: string
  url: string
  snippet: string
}

export interface Url {
  name: string
  url: string
  description: string
}

export const search = async (searchTerm: string, perPage: number = 3) => {
  const url = `${env.BING_ENDPOINT}?q=${encodeURIComponent(
    searchTerm
  )}&count=${perPage}`

  const response = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": env.BING_SEARCH_API_KEY,
    },
  })
  const data = await response.json()

  const results = data.webPages.value.map((result: CrawlResult) => ({
    title: result.name,
    url: result.url,
    description: result.snippet,
  }))
  console.log(
    "Bing Search urls ",
    results.map((url: Url) => url.url)
  )
  return results
}
