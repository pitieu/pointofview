import { getServerSession } from "next-auth"
import * as z from "zod"
import fs from "fs"
import path from "path"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { postPatchSchema } from "@/lib/validations/post"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

const blocksToMarkdown = (blocks) => {
  const markdownContent = blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `# ${block.data.text}`
        case "paragraph":
          return block.data.text
        case "markdown":
          return block.data.text
        case "callout":
          return `<Callout>${block.data.text}</Callout>`
        case "list":
          return block.data.items.map((item) => `- ${item}`).join("\n")
        case "quote":
          return `> ${block.data.text}`
        case "code":
          return `\`\`\`${block.data.language}\n${block.data.code}\n\`\`\``
        case "delimiter":
          return `---`
        case "raw":
          return block.data.html
        case "image":
          return `![${block.data.caption}](${block.data.file.url})`
        case "table":
          const elem =
            "| ------------- ".repeat(block.data.content[0].length) + "|"
          let blocks = block.data.content.map(
            (row) => "|" + row.join(" | ") + "|"
          )
          blocks.splice(1, 0, elem)

          return blocks.join("\n")
        // add cases for other block types as needed
        default:
          return block.data.text
      }
    })
    .join("\n\n")
  return markdownContent
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await db.post.delete({
      where: {
        id: params.postId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    console.log("CALLED PATCH")
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = postPatchSchema.parse(json)

    const markdown = blocksToMarkdown(body.content.blocks)
    if (!body.title) {
      body.title = "Untitled"
    }
    const filename = `${body.title.replace(/\s/g, "-").toLowerCase()}.mdx`

    // check if file exists in content/blog
    const fileExists = fs.existsSync(
      path.join(process.cwd(), "content/blog", filename)
    )
    if (fileExists) {
      // if it does, delete it
      fs.unlinkSync(path.join(process.cwd(), "content/blog", filename))
    }
    const content = `---
title: ${body.title}
date: ${new Date().toISOString()}
description: ${body.title}
image: /images/blog/blog-post-2.jpg
authors:
  - aricantik
---
${markdown}`

    // create new file
    fs.writeFileSync(
      path.join(process.cwd(), "content/blog", filename),
      content
    )

    // Update the post.
    // TODO: Implement sanitization for content.
    await db.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.post.count({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  })

  return count > 0
}
