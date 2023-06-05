import * as fs from "fs"
import path from "path"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import * as cheerio from "cheerio"
import * as mime from "mime-types"

import jsFile from "./jsFile"

const extractSubdomain = (url: string | null): string => {
  if (!url) return ""
  const domain = url.includes("://") ? url.split("://")[1] : url
  return domain.split(".")[0]
}

// removes double slashes due to url concat
const cleanUrl = (url: string): string => {
  const clean = url.replace(/(https?:\/\/)|(\/)+/g, (match, p1, p2) =>
    p1 ? p1 : "/"
  )
  return clean
}

const extractPath = (url: string): string => {
  try {
    const path = url.startsWith("/") ? url : new URL(url).pathname
    return path
  } catch (e) {
    console.error(e)
    return ""
  }
}

const replaceExtraSlashes = (url: string): string => {
  return url.replace(/(https?:\/\/)|(\/)+/g, (match, p1) => p1 ?? "/")
}

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    const myHost = headersList.get("host")
    const referer = headersList.get("referer")
    if (!myHost) throw new Error("No host given")
    if (!referer) throw new Error("No referer given")

    const subdomain = extractSubdomain(myHost)

    if (!subdomain) throw new Error("No subdomain given")
    const URL_REPLACE = `http://${myHost}/api/markup/`

    const nextUrl = new URL(request.nextUrl.href)
    const url = replaceExtraSlashes(
      "http://lifegoeson360.online/" +
        // "https://tailwindcss.com" +
        nextUrl.pathname.replace("/api/markup", "")
    )
    const { hostname } = new URL(url)

    if (!url) throw new Error("No url given")
    const contentType =
      mime.contentType(path.extname(new URL(nextUrl).pathname)) ||
      "text/html; charset=utf-8"

    const replaceImportURLs = (css: string, hostname: string): string => {
      // Use a regular expression to find and replace the '@import' URLs
      return css.replace(
        /@import\s+(url\(\s*['"]?)([^'")]+)(['"]?\s*\))/gi,
        (match, p1, p2, p3) => {
          if (p2.indexOf(hostname) > -1) {
            return `@import url("${getNewUrl(p2)}")`
          }
          return match
        }
      )
    }

    const replaceURLs = (css: string, hostname: string): string => {
      // Use a regular expression to find and replace the 'url()' URLs
      return css.replace(
        /url\(\s*(['"]?)([^'")]+)(['"]?)\s*\)/gi,
        (match, p1, p2, p3) => {
          if (p2.indexOf(hostname) > -1) {
            return `url("${getNewUrl(p2)}")`
          }
          return match
        }
      )
    }

    const replaceInCSS = ($: cheerio.CheerioAPI, hostname: string): void => {
      $("style").each(function () {
        const element = $(this)
        let css = element.html()

        if (css) {
          css = replaceImportURLs(css, hostname)
          css = replaceURLs(css, hostname)
          element.html(css)
        }
      })
    }

    const getNewUrl = (originalUrl: string) => {
      if (originalUrl.startsWith("/"))
        return cleanUrl(URL_REPLACE + originalUrl) // handle / paths
      const newPath = extractPath(originalUrl)
      const newUrl = cleanUrl(URL_REPLACE + newPath)
      return newUrl
    }

    // fetch Url
    const response = await fetch(url, {
      headers: { "content-type": contentType },
    })

    if (contentType.indexOf("image") > -1) {
      const bodyBuffer = await response.arrayBuffer()
      return new Response(bodyBuffer, {
        headers: { "content-type": contentType },
      })
    }

    let html = await response.text()
    // only modify html files
    if (contentType.indexOf("text/html") > -1) {
      const $ = cheerio.load(html)

      const replaceAttr = (element: any, attrName: string) => {
        const attrValue = element.attr(attrName)
        if (
          attrValue &&
          (attrValue.indexOf(hostname) > -1 || attrValue.startsWith("/"))
        ) {
          element.attr(attrName, `${getNewUrl(attrValue)}`)
        }
      }

      $("link, a, img, script, video, audio, iframe").each(function () {
        const element = $(this)

        replaceAttr(element, "href")
        replaceAttr(element, "src")
        replaceAttr(element, "data")
      })

      let attributes = ["srcset", "poster", "action", "style", "content"]
      attributes.forEach((attribute) => {
        $(`[${attribute}]`).each(function () {
          let value = $(this).attr(attribute)
          if (value && value.startsWith("/")) {
            value = URL_REPLACE + value
            $(this).attr(attribute, value)
          }
        })
      })

      replaceInCSS($, hostname)

      $("[style]").each(function () {
        const element = $(this)

        let style = element.attr("style")
        if (style) {
          let declarations = style.split(";")
          for (let i = 0; i < declarations.length; i++) {
            let declaration = declarations[i].trim()
            if (declaration.startsWith("background-image")) {
              let urlMatch = declaration.match(/url\((.*?)\)/)
              if (urlMatch && urlMatch[1].startsWith("/")) {
                const newUrl = cleanUrl(URL_REPLACE + urlMatch[1])
                declarations[i] = declaration.replace(
                  /url\((.*?)\)/,
                  `url(${newUrl})`
                )
              }
            }
          }
          element.attr("style", declarations.join("; "))
        }
      })

      const data = String(jsFile)
      // add style script
      $("head").append(
        `<style>
          html.markup-comment-mode, html.markup-comment-mode body, html.markup-comment-mode body * {
              cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAstJREFUSImtlV2IVVUYhp9vnW1HknGYJPEnCbVgCJrJn3Gg8CJInLwwvdCyggymEO9CC69kEC+UfpggwaBImyjyh0iR8Y+QJCqYLlLBfr2QcJQodZzIM3uv7/Vi5nDOqZk9M6de2LDXXu/3vd/7rb3WMklbgHYmjhJwFfgF6DWzy7lsSQdVP9xd30haOVb+BIgA84sZ6dD45TdMh1lzjeaHYeWaYE+utWXFqRx3V68Zz5vZn9V8k/QxsOGBuzNu/z2+wD8x+z54bWeBdS8Y7lwKgQ4z+7k8HwAHKBQmnxyg/zd4ZWPk1U7HI/PdOS7pnmqBCBBCfQJlfPK+s7UzWggsAHqqBRwg1OmgGoc+FD17HWBVeeEn1aLu/QW2dOVbfWO789cgLtFVFphwi1qWGEsfs1zOH7/DgX0ezGiXNO9/bVEZJz8XgAGrKgL/cZGr8X2fyq8LkrJAkvybuOPtwKJllZY0zRDTGoyjXw/bLSTwwTvOwf2qiRu4AaXbeHEqcxJgAGBagwG1xJvXYXCwMo4RPFa+hQIM3hrdhQ3XVUqAfoBZc+DHC7WkN7u8ZvzFhYRr/WLDijh61hE0NsFdRQJwJQA/AbQszf87JoPWSq6LATgjcatjTVBOzKSwYrUhkQG9wcxKZnzW2oa1L893ce470fdVfh0z7oWnX7RoxjEzu2EAkhZKXDzXp+SpR6NlWf3V73438OxLwc14xMzOBwAz+9WMt1rbzLq6698Q6zcGnns5YMYeMztfMympIOmEJL3XHXV/kmouE3+2dkalqaKkM5KmjFqBpMayyLdnPXYszsZN3DYv1eGPPI5coaclNeXaHHGyy11D7tKXpzzdtinqiZZMrTNTNTemevyhTJufyXTkU8/SIWXuSiW9LmmU82BsoYWS9km6OfaNrwFJPZIeHCvPuLtLUhFYDjQDsxk+T64CPwBnzayUF38H/abEdJrmV6IAAAAASUVORK5CYII="), copy !important;
              cursor: -webkit-image-set(
                          url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAstJREFUSImtlV2IVVUYhp9vnW1HknGYJPEnCbVgCJrJn3Gg8CJInLwwvdCyggymEO9CC69kEC+UfpggwaBImyjyh0iR8Y+QJCqYLlLBfr2QcJQodZzIM3uv7/Vi5nDOqZk9M6de2LDXXu/3vd/7rb3WMklbgHYmjhJwFfgF6DWzy7lsSQdVP9xd30haOVb+BIgA84sZ6dD45TdMh1lzjeaHYeWaYE+utWXFqRx3V68Zz5vZn9V8k/QxsOGBuzNu/z2+wD8x+z54bWeBdS8Y7lwKgQ4z+7k8HwAHKBQmnxyg/zd4ZWPk1U7HI/PdOS7pnmqBCBBCfQJlfPK+s7UzWggsAHqqBRwg1OmgGoc+FD17HWBVeeEn1aLu/QW2dOVbfWO789cgLtFVFphwi1qWGEsfs1zOH7/DgX0ezGiXNO9/bVEZJz8XgAGrKgL/cZGr8X2fyq8LkrJAkvybuOPtwKJllZY0zRDTGoyjXw/bLSTwwTvOwf2qiRu4AaXbeHEqcxJgAGBagwG1xJvXYXCwMo4RPFa+hQIM3hrdhQ3XVUqAfoBZc+DHC7WkN7u8ZvzFhYRr/WLDijh61hE0NsFdRQJwJQA/AbQszf87JoPWSq6LATgjcatjTVBOzKSwYrUhkQG9wcxKZnzW2oa1L893ce470fdVfh0z7oWnX7RoxjEzu2EAkhZKXDzXp+SpR6NlWf3V73438OxLwc14xMzOBwAz+9WMt1rbzLq6698Q6zcGnns5YMYeMztfMympIOmEJL3XHXV/kmouE3+2dkalqaKkM5KmjFqBpMayyLdnPXYszsZN3DYv1eGPPI5coaclNeXaHHGyy11D7tKXpzzdtinqiZZMrTNTNTemevyhTJufyXTkU8/SIWXuSiW9LmmU82BsoYWS9km6OfaNrwFJPZIeHCvPuLtLUhFYDjQDsxk+T64CPwBnzayUF38H/abEdJrmV6IAAAAASUVORK5CYII=") 1x,
                          url("data:image/png;base64,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") 2x
                      ) 0 0, copy !important;
          }
          html.markup-dragging-pin, html.markup-dragging-pin body, html.markup-dragging-pin body * {
              cursor: grabbing !important;
          }
          .hidden-s {
              display: none !important;
          }
            
          </style>
          <script type="text/javascript" async>
          ${data}
          def("${referer.replace(/\/$/, "")}")
          </script>
      `
      )

      html = $.html()

      console.log("content-type", contentType)
    }

    return new Response(html, {
      headers: {
        "content-type": contentType,
      },
    })
  } catch (error) {
    console.log(error)
    return { message: error.message }
  }
}
