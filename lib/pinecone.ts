import { PineconeClient } from "@pinecone-database/pinecone"
import { env } from "@/env.mjs"

export async function initPinecone() {
  try {
    const pinecone = new PineconeClient()

    await pinecone.init({
      environment: env.PINECONE_ENVIRONMENT, //this is in the dashboard
      apiKey: env.PINECONE_API_KEY,
    })

    return pinecone
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to initialize Pinecone Client")
  }
}

export const pinecone = initPinecone().then((res) => res)
