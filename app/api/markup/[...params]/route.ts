import * as fs from "fs"
import path from "path"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { decodeFromBase36 } from "@/utils/string"
import * as cheerio from "cheerio"
import * as mime from "mime-types"

import jsFile from "./jsFile.js"

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

    const originalUrl = new URL(
      decodeFromBase36(
        // "http://localhost:3000" +
        // "https://www.indiehackers.com/" +
        // "http://lifegoeson360.online/" +
        // "https://tailwindcss.com" +
        subdomain
      )
    )

    const url = replaceExtraSlashes(
      originalUrl.origin + nextUrl.pathname.replace("/api/markup", "")
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
        `
        <script src="https://code.jquery.com/jquery-3.7.0.slim.min.js" integrity="sha256-tG5mcZUtJsZvyKAxYLVXrmjKBVLd6VpVccqz/r4ypFE=" crossorigin="anonymous"></script>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <style>
        
          .m-comment-mode {
            cursor: pointer !important;
            // cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAQAAACJ4248AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+cGBQghD2043cIAAAQLSURBVFjD7ZdfTFNXHMe/9/beFivMRUwWOuA2m4F04GhxjbrIg2HAAMm2qugeZuLmg5M9QDKjmbI4NQZeNsPciMbsARe3TJ01cTFsLETS4p8BHQmF4oqxFFCbiUopeO/13rOH2660a0Hksic/ycnJvb9z+vv+zvmd37kFnrMIZIpW62sfNjdbfunpsZS63QW/XrzIkW3bAIaJH0up6TjjhF6fntbSMvnZpk05nxDyxjhF6XSA1wt03iNERw8PBw9UVvrXu92LEDfDmP5wOAq+lKS2NvIf/H5Cqs/L8sqmUMjYm5ubcAWyGg0G6puMjPm45XM9nnu/hULG3j17tC0NDfaPaNpkUmxjY8DQEFBUpDwLAlA9Jcue4r6+wR6zGSAEAPBSydKl+a87nRxHyHxbXafPJ/UEAuZJUWxsjI26qYmQkpLYd/394blfbNgAAAwA6Aw1NVTdmjVnlgGZmfNbeIMhO9tzE3iQB7zTGmuTZaXNxGQCXvlYFIdcpaVAezsDAHSvxbJWq9G8efLZdv/u3fAWZil9WRkwOBi1G42ATgecOwesWgUYJZq+tVwJVTkW7QzD7n825wCQmqr0wSCg1wNHjgCBAHD5MtDVBdTXKwcwJ0cZN/62KBJuYgLNEQELxGQCWBZwOgGbDbBalfdeL+DxAJWV0bGTk0DfFZalr924EV2BOOx2ZbnmIjsbOHoUSEsDKiqAJpcoVlSwbEqKYs/PB+7fj53z9UpJIgXBIP2X3Z5UQHq68uNzEdlzANi7F9i4kWV3GQXh2/e1Wr0eKC5WWoTv/5blE7k0jda6Oh/16NG/BuODs2d37yYLxuUipLCQEGuKKDZ3SlJXl3LsLlwg5L1PJya4DySJI/v2zQxClRyIYDYDra3A8eMMc7IGaBgPO2EA8bTTSf106JCPunp1TgFPmwMzYVng4EGA45S+vl45CdPTgMEALFlSXp5o3oJyIF6AXh991miASFHvNksSV7tune9YbPRJBRQVReu3Gnx3hqYh1NYigQBaPTfJITKAP6mEV78qdWAhqFYHVBWgdg7Mxv+SA9gV/vBIJoC8ODrqCTx+HH93q4EsAwPlPE9co6OJ7BQAZDny8pi3urtfPszzrxZIEgCkHGbZz39MTTUYooNP5z158vuxYHA+ArwdGs3Yz1qt/EJhoe/awEC8nQEA/3q3m1trsQzbdu70d4RTa3jLliqXUsUkCThwned/WM2ypLejg1ohCE8rgOzw+6m2U6cSOZ8VjiPk0iVCQiFCtr87Pc3d4nnj9q1b1d6iWS+jhw+B6tKpqX5eEGRSVeVvcTjUFpD0j4lxhyRRGgCrb98Wb5aVjXzl9artHAA0yQzLVrCsvPnOHUGw2cb2j4wshvPnAMA/SM0ZB+irpgAAAAAASUVORK5CYII="), copy;
            //   cursor: -webkit-image-set(
            //               url"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAQAAACJ4248AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+cGBQghD2043cIAAAQLSURBVFjD7ZdfTFNXHMe/9/beFivMRUwWOuA2m4F04GhxjbrIg2HAAMm2qugeZuLmg5M9QDKjmbI4NQZeNsPciMbsARe3TJ01cTFsLETS4p8BHQmF4oqxFFCbiUopeO/13rOH2660a0Hksic/ycnJvb9z+vv+zvmd37kFnrMIZIpW62sfNjdbfunpsZS63QW/XrzIkW3bAIaJH0up6TjjhF6fntbSMvnZpk05nxDyxjhF6XSA1wt03iNERw8PBw9UVvrXu92LEDfDmP5wOAq+lKS2NvIf/H5Cqs/L8sqmUMjYm5ubcAWyGg0G6puMjPm45XM9nnu/hULG3j17tC0NDfaPaNpkUmxjY8DQEFBUpDwLAlA9Jcue4r6+wR6zGSAEAPBSydKl+a87nRxHyHxbXafPJ/UEAuZJUWxsjI26qYmQkpLYd/394blfbNgAAAwA6Aw1NVTdmjVnlgGZmfNbeIMhO9tzE3iQB7zTGmuTZaXNxGQCXvlYFIdcpaVAezsDAHSvxbJWq9G8efLZdv/u3fAWZil9WRkwOBi1G42ATgecOwesWgUYJZq+tVwJVTkW7QzD7n825wCQmqr0wSCg1wNHjgCBAHD5MtDVBdTXKwcwJ0cZN/62KBJuYgLNEQELxGQCWBZwOgGbDbBalfdeL+DxAJWV0bGTk0DfFZalr924EV2BOOx2ZbnmIjsbOHoUSEsDKiqAJpcoVlSwbEqKYs/PB+7fj53z9UpJIgXBIP2X3Z5UQHq68uNzEdlzANi7F9i4kWV3GQXh2/e1Wr0eKC5WWoTv/5blE7k0jda6Oh/16NG/BuODs2d37yYLxuUipLCQEGuKKDZ3SlJXl3LsLlwg5L1PJya4DySJI/v2zQxClRyIYDYDra3A8eMMc7IGaBgPO2EA8bTTSf106JCPunp1TgFPmwMzYVng4EGA45S+vl45CdPTgMEALFlSXp5o3oJyIF6AXh991miASFHvNksSV7tune9YbPRJBRQVReu3Gnx3hqYh1NYigQBaPTfJITKAP6mEV78qdWAhqFYHVBWgdg7Mxv+SA9gV/vBIJoC8ODrqCTx+HH93q4EsAwPlPE9co6OJ7BQAZDny8pi3urtfPszzrxZIEgCkHGbZz39MTTUYooNP5z158vuxYHA+ArwdGs3Yz1qt/EJhoe/awEC8nQEA/3q3m1trsQzbdu70d4RTa3jLliqXUsUkCThwned/WM2ypLejg1ohCE8rgOzw+6m2U6cSOZ8VjiPk0iVCQiFCtr87Pc3d4nnj9q1b1d6iWS+jhw+B6tKpqX5eEGRSVeVvcTjUFpD0j4lxhyRRGgCrb98Wb5aVjXzl9artHAA0yQzLVrCsvPnOHUGw2cb2j4wshvPnAMA/SM0ZB+irpgAAAAAASUVORK5CYII=") 1x,
            //               url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAQAAACJ4248AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+cGBQghD2043cIAAAQLSURBVFjD7ZdfTFNXHMe/9/beFivMRUwWOuA2m4F04GhxjbrIg2HAAMm2qugeZuLmg5M9QDKjmbI4NQZeNsPciMbsARe3TJ01cTFsLETS4p8BHQmF4oqxFFCbiUopeO/13rOH2660a0Hksic/ycnJvb9z+vv+zvmd37kFnrMIZIpW62sfNjdbfunpsZS63QW/XrzIkW3bAIaJH0up6TjjhF6fntbSMvnZpk05nxDyxjhF6XSA1wt03iNERw8PBw9UVvrXu92LEDfDmP5wOAq+lKS2NvIf/H5Cqs/L8sqmUMjYm5ubcAWyGg0G6puMjPm45XM9nnu/hULG3j17tC0NDfaPaNpkUmxjY8DQEFBUpDwLAlA9Jcue4r6+wR6zGSAEAPBSydKl+a87nRxHyHxbXafPJ/UEAuZJUWxsjI26qYmQkpLYd/394blfbNgAAAwA6Aw1NVTdmjVnlgGZmfNbeIMhO9tzE3iQB7zTGmuTZaXNxGQCXvlYFIdcpaVAezsDAHSvxbJWq9G8efLZdv/u3fAWZil9WRkwOBi1G42ATgecOwesWgUYJZq+tVwJVTkW7QzD7n825wCQmqr0wSCg1wNHjgCBAHD5MtDVBdTXKwcwJ0cZN/62KBJuYgLNEQELxGQCWBZwOgGbDbBalfdeL+DxAJWV0bGTk0DfFZalr924EV2BOOx2ZbnmIjsbOHoUSEsDKiqAJpcoVlSwbEqKYs/PB+7fj53z9UpJIgXBIP2X3Z5UQHq68uNzEdlzANi7F9i4kWV3GQXh2/e1Wr0eKC5WWoTv/5blE7k0jda6Oh/16NG/BuODs2d37yYLxuUipLCQEGuKKDZ3SlJXl3LsLlwg5L1PJya4DySJI/v2zQxClRyIYDYDra3A8eMMc7IGaBgPO2EA8bTTSf106JCPunp1TgFPmwMzYVng4EGA45S+vl45CdPTgMEALFlSXp5o3oJyIF6AXh991miASFHvNksSV7tune9YbPRJBRQVReu3Gnx3hqYh1NYigQBaPTfJITKAP6mEV78qdWAhqFYHVBWgdg7Mxv+SA9gV/vBIJoC8ODrqCTx+HH93q4EsAwPlPE9co6OJ7BQAZDny8pi3urtfPszzrxZIEgCkHGbZz39MTTUYooNP5z158vuxYHA+ArwdGs3Yz1qt/EJhoe/awEC8nQEA/3q3m1trsQzbdu70d4RTa3jLliqXUsUkCThwned/WM2ypLejg1ohCE8rgOzw+6m2U6cSOZ8VjiPk0iVCQiFCtr87Pc3d4nnj9q1b1d6iWS+jhw+B6tKpqX5eEGRSVeVvcTjUFpD0j4lxhyRRGgCrb98Wb5aVjXzl9artHAA0yQzLVrCsvPnOHUGw2cb2j4wshvPnAMA/SM0ZB+irpgAAAAAASUVORK5CYII=") 2x
            //           ) 0 0, copy;
          }
          .m-pin {
            cursor: pointer !important;
          }
          .m-pin-dragging {
            cursor: grabbing !important;
            opacity: 70% !important;
          ]
          .hidden-s {
              display: none !important;
          }
          .editor {
            cursor: auto !important;
          }
            
          </style>
          <script type="text/javascript" async>
          ${data}
          setTimeout(def("${referer.replace(/\/$/, "")}", "1"),1000)
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
