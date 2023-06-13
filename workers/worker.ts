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

    console.log(jobs)
    for (let job in jobs) {
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/images/url`,
          {
            jobId: jobs[job].id,
            url: jobs[job].url,
            workerSecret: process.env.WORKER_SECRET,
          }
        )
      } catch (error) {
        console.log(error.response.data.error)
      }
    }
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
        image: { not: { equals: "" } },
      },
      take: 50,
    })

    for (let job in jobs) {
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/images/resize`,
          {
            jobId: jobs[job].id,
            url: jobs[job].image,
            workerSecret: process.env.WORKER_SECRET,
          }
        )
      } catch (error) {
        console.log(error.response.data.error)
      }
    }
  } catch (error) {
    console.error("Error processing message", error)
  }

  // keep polling
  setTimeout(resizeThumbnail, 30000)
}

resizeThumbnail()
verifyImage()
