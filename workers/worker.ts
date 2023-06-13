import axios from "axios"
import * as dotenv from "dotenv"

import { db } from "../lib/db"

dotenv.config()

async function verifyImage() {
  try {
    const jobs = await db.job.findMany({
      where: {
        image: { equals: "" },
      },
      take: 50,
    })

    jobs.forEach((job) => {
      axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/images/url`, {
        jobId: job.id,
        url: job.url,
        workerSecret: process.env.WORKER_SECRET,
      })
    })
  } catch (error) {
    console.error("Error processing message", error)
  }

  // keep polling
  setTimeout(verifyImage, 30000)
}

async function resizeThumbnail() {
  try {
    const jobs = await db.job.findMany({
      where: {
        thumbnail: { equals: "" },
      },
      take: 50,
    })

    jobs.forEach((job) => {
      axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/images/resize`, {
        jobId: job.id,
        url: job.url,
        workerSecret: process.env.WORKER_SECRET,
      })
    })
  } catch (error) {
    console.error("Error processing message", error)
  }

  // keep polling
  setTimeout(resizeThumbnail, 30000)
}

resizeThumbnail()
verifyImage()
