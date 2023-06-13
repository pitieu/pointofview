import { exec } from "child_process"
import * as crypto from "crypto"
import * as fs from "fs"
import * as path from "path"
import axios from "axios"
import * as screenshotone from "screenshotone-api-sdk"
import sharp from "sharp"

import { env } from "@/env.mjs"

const __dirname = path.resolve()

const imageFolder = "public/images/uploads/"

interface IMAGE_RESPONSE {
  image: string
}

export const screenshotLocalUrl = async (url: string): Promise<string> => {
  try {
    const validUrl = new URL(url)
    const response: { data: IMAGE_RESPONSE } = await axios.get(
      `http://localhost:4000/screenshot?url=${validUrl.href}`
    )
    let imageBase64: string
    if (response.data) {
      imageBase64 = response.data.image
    } else {
      throw new Error("failed to get screenshot")
    }
    return imageBase64
  } catch (e) {
    throw e
  }
}
export const screenshotOneUrl = async (url: string): Promise<string> => {
  console.log("screenshotOneUrl")
  const client = new screenshotone.Client(
    env.SCREENSHOT_API,
    env.SCREENSHOT_SECRET
  )
  const options = screenshotone.AnimateOptions.url(url)
    .scriptsWaitUntil("networkidle0")
    .format("gif")
    .scrollStartImmediately(true)
    .scenario("scroll")

  const imageBlob = await client.animate(options)

  const buffer = Buffer.from(await imageBlob.arrayBuffer())
  return buffer.toString("base64")
}

export const createThumbnailFromUrl = async (
  url: string
): Promise<{ url: string; thumbnail: string; image: string }> => {
  console.log("createThumbnailFromUrl", url)
  console.log("env.SCREENSHOT_ENABLED:", env.SCREENSHOT_ENABLED)

  let buffer: Buffer

  // create a unique id for the url
  const hash = crypto.createHash("sha256")
  hash.update(url)
  const urlId = hash.digest("hex")

  if (env.SCREENSHOT_ENABLED == "local") {
    console.log("Local Screenshot")
    const response = await axios.get(
      `http://localhost:4000/screenshot?url=${url}`
    )
    if (response.data) {
      buffer = Buffer.from(response.data.image, "base64")
    } else {
      throw new Error("failed to get screenshot")
    }

    const pathImage = path.join(imageFolder, `${urlId}.jpg`)

    fs.writeFileSync(pathImage, buffer)

    await resizeImage(`${urlId}`)

    return Promise.resolve({
      url: `/images/uploads/${urlId}.jpg`,
      thumbnail: `/images/uploads/${urlId}_tiny.jpg`,
      image: buffer.toString("base64"),
    })
  }

  console.log("ScreenshotOne Screenshot")
  const client = new screenshotone.Client(
    env.SCREENSHOT_API,
    env.SCREENSHOT_SECRET
  )

  const options = screenshotone.AnimateOptions.url(url)
    .scriptsWaitUntil("networkidle0")
    .format("gif")
    .scrollStartImmediately(true)
    .scenario("scroll")

  const imageBlob = await client.animate(options)

  buffer = Buffer.from(await imageBlob.arrayBuffer())

  const pathImage = path.join(imageFolder, `${urlId}.gif`)
  fs.writeFileSync(pathImage, buffer)

  await resizeGif(`${urlId}`, 200)
  return Promise.resolve({
    url: `/images/uploads/${urlId}.gif`,
    thumbnail: `/images/uploads/${urlId}_tiny.gif`,
    image: buffer.toString("base64"),
  })
}

export const createThumbnail = async (
  filename: string,
  resizeWidth: number = 200
): Promise<void> => {
  console.log("createThumbnail")
  const inputBuffer = fs.readFileSync(path.join(imageFolder, filename + ".gif"))
  const outputPath = path.join(__dirname, imageFolder, filename + "_small.gif")

  const buffer = Buffer.from(inputBuffer)

  // Resize the image
  const resizedBuffer = await sharp(buffer)
    .resize(resizeWidth) // The width of the thumbnail
    .jpeg({ quality: 50 }) // Compress the image
    .toBuffer()

  fs.writeFileSync(outputPath, resizedBuffer)
  return Promise.resolve()
}

export const resizeImageFromUrl = async (
  imageURL: string,
  resizeWidth: number = 200,
  resizeHeight: number = resizeWidth
) => {
  console.log("imageUrl", imageURL)

  const response = await axios({
    url: imageURL,
    method: "GET",
    responseType: "arraybuffer",
  })
  console.log("image response", response.headers["content-type"])

  if (!response.headers["content-type"].startsWith("image")) {
    throw new Error("URL does not point to an image")
  }

  const inputBuffer = Buffer.from(response.data, "binary")
  const outputBuffer = await sharp(inputBuffer)
    .resize(resizeWidth, resizeHeight, {
      fit: "cover",
      position: "top",
    })
    .toBuffer()
  return outputBuffer
}

export const resizeImage = async (
  filename: string,
  resizeWidth: number = 200
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(__dirname, imageFolder, filename + ".jpg")
    const outputPath = path.join(__dirname, imageFolder, filename + "_tiny.jpg")
    sharp(inputPath)
      .resize(resizeWidth, resizeWidth, {
        fit: "cover",
        position: "top",
      })
      .toFile(outputPath, (err) => {
        if (err) {
          console.error("Error while resizing image:", err)
          reject()
        } else {
          console.log("Image resized and saved:", outputPath)
          resolve()
        }
      })
  })
}

export const resizeGif = async (
  filename: string,
  resizeWidth: number = 200
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Read the GIF image
    const inputPath = path.join(__dirname, imageFolder, filename + ".gif")
    const outputPath = path.join(__dirname, imageFolder, filename + "_tiny.gif")
    const command = `gifsicle --resize-width ${resizeWidth} --output ${outputPath} ${inputPath}`

    // // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return reject(error)
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return reject(stderr)
      }
      console.log(`file: ${inputPath}`)
      resolve()
    })
  })
}
