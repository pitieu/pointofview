import path from "path"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import * as cheerio from "cheerio"
import * as mime from "mime-types"

const URL_REPLACE = "http://asda.localhost:3000/api/markup/"

const getSubdomain = (url) => {
  let domain = url
  if (url.includes("://")) {
    domain = url.split("://")[1]
  }
  const subdomain = domain.split(".")[0]
  return subdomain
}

const getNewUrl = (originalUrl: string) => {
  try {
    // Extract the path from the original URL
    if (originalUrl.startsWith("/")) {
      return (URL_REPLACE + originalUrl).replace(
        /(https?:\/\/)|(\/)+/g,
        (match, p1, p2) => {
          return p1 ? p1 : "/"
        }
      )
    }
    const url = new URL(originalUrl)
    const path = url.pathname

    return (URL_REPLACE + path).replace(
      /(https?:\/\/)|(\/)+/g,
      (match, p1, p2) => {
        return p1 ? p1 : "/"
      }
    )
  } catch (e) {
    console.log(e)
    return URL_REPLACE
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("MARKUP called")
    const headersList = headers()
    const mihost = headersList.get("host")
    const subdomain = getSubdomain(mihost)
    const nextUrl = request.nextUrl.href
    const removeDomain = new URL(nextUrl)
    const url = (
      "http://lifegoeson360.online/" + removeDomain.pathname.slice(11)
    ) // remove /api/markup
      .replace(/(https?:\/\/)|(\/)+/g, (match, p1, p2) => {
        return p1 ? p1 : "/"
      })
    const { hostname } = new URL(url)

    if (!url) throw new Error("No url given")
    const contentType =
      mime.contentType(path.extname(new URL(nextUrl).pathname)) ||
      "text/html; charset=utf-8"

    console.log(removeDomain.pathname.slice(11), url)
    // fetch Url
    const response = await fetch(url, {
      headers: {
        "content-type": contentType,
      },
    })
    let html = await response.text()
    if (contentType === "text/html; charset=utf-8") {
      const $ = cheerio.load(html)

      $("link, a, img, script, video, audio, iframe").each(function () {
        const element = $(this)

        const href = element.attr("href")
        const src = element.attr("src")
        const data = element.attr("data")

        if (href) {
          if (element.attr("rel") !== "stylesheet") {
            element.attr("href", `${getNewUrl(href)}`)
          } else {
            console.log(href)
            // if (
            //   element.attr("id") === "wp-block-library-css" ||
            //   element.attr("id") === "classic-theme-styles-css" ||
            //   element.attr("id") === "mh-femininemag-css"
            // ) {
            element.attr("href", `${getNewUrl(href)}`)
            // }
          }
        }

        if (src && src.indexOf(hostname) > -1) {
          element.attr("src", `${getNewUrl(src)}`)
        }

        // replace data attributes
        if (data && data.indexOf(hostname) > -1) {
          element.attr("data", `${getNewUrl(data)}`)
        }
      })

      // replace '@import' in css
      $("style").each(function () {
        const element = $(this)
        let css = element.html()

        if (css) {
          // Use a regular expression to find and replace the '@import' URLs
          css = css.replace(
            /@import\s+(url\(\s*['"]?)([^'")]+)(['"]?\s*\))/gi,
            (match, p1, p2, p3) => {
              if (p2.indexOf(hostname) > -1) {
                const modifiedUrl = `${getNewUrl(p2)}`
                return `@import url("${modifiedUrl}")`
              }
              return `@import url("${p2}")`
            }
          )

          css = css.replace(
            /url\(\s*(['"]?)([^'")]+)(['"]?)\s*\)/gi,
            (match, p1, p2, p3) => {
              let modifiedUrl
              if (p2.startsWith("/") || p2.startsWith("http")) {
                modifiedUrl = `${getNewUrl(p2)}`
              } else if (p2.indexOf(hostname) > -1) {
                modifiedUrl = `${getNewUrl(p2)}`
              } else {
                modifiedUrl = p2
              }
              return `url("${modifiedUrl}")`
            }
          )

          element.html(css)
        }
      })

      // add style script
      // $("head").append(
      //   `<style>
      //     html.markup-comment-mode, html.markup-comment-mode body, html.markup-comment-mode body * {
      //         cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAstJREFUSImtlV2IVVUYhp9vnW1HknGYJPEnCbVgCJrJn3Gg8CJInLwwvdCyggymEO9CC69kEC+UfpggwaBImyjyh0iR8Y+QJCqYLlLBfr2QcJQodZzIM3uv7/Vi5nDOqZk9M6de2LDXXu/3vd/7rb3WMklbgHYmjhJwFfgF6DWzy7lsSQdVP9xd30haOVb+BIgA84sZ6dD45TdMh1lzjeaHYeWaYE+utWXFqRx3V68Zz5vZn9V8k/QxsOGBuzNu/z2+wD8x+z54bWeBdS8Y7lwKgQ4z+7k8HwAHKBQmnxyg/zd4ZWPk1U7HI/PdOS7pnmqBCBBCfQJlfPK+s7UzWggsAHqqBRwg1OmgGoc+FD17HWBVeeEn1aLu/QW2dOVbfWO789cgLtFVFphwi1qWGEsfs1zOH7/DgX0ezGiXNO9/bVEZJz8XgAGrKgL/cZGr8X2fyq8LkrJAkvybuOPtwKJllZY0zRDTGoyjXw/bLSTwwTvOwf2qiRu4AaXbeHEqcxJgAGBagwG1xJvXYXCwMo4RPFa+hQIM3hrdhQ3XVUqAfoBZc+DHC7WkN7u8ZvzFhYRr/WLDijh61hE0NsFdRQJwJQA/AbQszf87JoPWSq6LATgjcatjTVBOzKSwYrUhkQG9wcxKZnzW2oa1L893ce470fdVfh0z7oWnX7RoxjEzu2EAkhZKXDzXp+SpR6NlWf3V73438OxLwc14xMzOBwAz+9WMt1rbzLq6698Q6zcGnns5YMYeMztfMympIOmEJL3XHXV/kmouE3+2dkalqaKkM5KmjFqBpMayyLdnPXYszsZN3DYv1eGPPI5coaclNeXaHHGyy11D7tKXpzzdtinqiZZMrTNTNTemevyhTJufyXTkU8/SIWXuSiW9LmmU82BsoYWS9km6OfaNrwFJPZIeHCvPuLtLUhFYDjQDsxk+T64CPwBnzayUF38H/abEdJrmV6IAAAAASUVORK5CYII="), copy !important;
      //         cursor: -webkit-image-set(
      //                     url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAstJREFUSImtlV2IVVUYhp9vnW1HknGYJPEnCbVgCJrJn3Gg8CJInLwwvdCyggymEO9CC69kEC+UfpggwaBImyjyh0iR8Y+QJCqYLlLBfr2QcJQodZzIM3uv7/Vi5nDOqZk9M6de2LDXXu/3vd/7rb3WMklbgHYmjhJwFfgF6DWzy7lsSQdVP9xd30haOVb+BIgA84sZ6dD45TdMh1lzjeaHYeWaYE+utWXFqRx3V68Zz5vZn9V8k/QxsOGBuzNu/z2+wD8x+z54bWeBdS8Y7lwKgQ4z+7k8HwAHKBQmnxyg/zd4ZWPk1U7HI/PdOS7pnmqBCBBCfQJlfPK+s7UzWggsAHqqBRwg1OmgGoc+FD17HWBVeeEn1aLu/QW2dOVbfWO789cgLtFVFphwi1qWGEsfs1zOH7/DgX0ezGiXNO9/bVEZJz8XgAGrKgL/cZGr8X2fyq8LkrJAkvybuOPtwKJllZY0zRDTGoyjXw/bLSTwwTvOwf2qiRu4AaXbeHEqcxJgAGBagwG1xJvXYXCwMo4RPFa+hQIM3hrdhQ3XVUqAfoBZc+DHC7WkN7u8ZvzFhYRr/WLDijh61hE0NsFdRQJwJQA/AbQszf87JoPWSq6LATgjcatjTVBOzKSwYrUhkQG9wcxKZnzW2oa1L893ce470fdVfh0z7oWnX7RoxjEzu2EAkhZKXDzXp+SpR6NlWf3V73438OxLwc14xMzOBwAz+9WMt1rbzLq6698Q6zcGnns5YMYeMztfMympIOmEJL3XHXV/kmouE3+2dkalqaKkM5KmjFqBpMayyLdnPXYszsZN3DYv1eGPPI5coaclNeXaHHGyy11D7tKXpzzdtinqiZZMrTNTNTemevyhTJufyXTkU8/SIWXuSiW9LmmU82BsoYWS9km6OfaNrwFJPZIeHCvPuLtLUhFYDjQDsxk+T64CPwBnzayUF38H/abEdJrmV6IAAAAASUVORK5CYII=") 1x,
      //                     url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAdhwAAHYcBj+XxZQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAW0SURBVGiB1ZprbFRVEMd/c3dpaaEQoOUhJCBgsYBoBVuCRXkZH4BEEAEjGAXRIPiBRAIYBQQVRA1GkEBQIEFFUDEiIBExDSBFrEQRiSCt4IOXPIttpbt3/HC7y559tNvutl3/SZOeOXPn/uecOTPnnLuiqh2BHOoWZcBl4FcR+Sueht1AHrAunkargqqWAAXATmCziByK1eBYbVh8p6pPqGpybfhbgB3TCMSO3sBK4JiqTlZVqyYPi6o+CGz0Cfp08FBWGl+GScnQKkPonAlZvYR+A4XefQV3o7Dq+4CJ0YaWqOoDwCc+wY3NPFwpiQvvKtEyHUaMtZgwRbghS4K7S4GpIrK6OjshIWS54keyKpz/G1YvtRnc08uTo72cKNbA7lTgXVVdpKoh3gUi1IEaRWDssG3Y8pEyqIeX5Ytt1PCDGcDKqpwIccBVTzMQjPIyeGmGzYShXi5fNLomAYsiPWcBXkPQQA748PU2ZdSdXs6cNMTPqupj4fQbPITC4fCPyti7vFw8b4iXqmqPYN2ECaFgHDmkTBrpxePxi1KBVcF1IiSEEsUBgIJ85fU5xvj2BYxQsgBj3YtVZdaqd7y9yOanAwbFuaqa5GvU2Qz0zBZy+zt/GW1qb8frhReeMWahAzDB16izRbzsfYt1X7hYv8PFoPtiM/rtbmXPTmMWJvv+CZ0Bd0zvMuykpMLVq/Gxt/INY5xvU9XukKBpNBzytytnTxmiYZDAaTQYHg/s2GJQHQwJnkaDEbQOciHMDEiChhDAwUKj2VxV2/5vQgjgeJHiqTBEXd3UchF36ipMnSkR9dNbOwVRBMY8LuT2D694ohiWzI/uVOupgAvnIKOtX9TcTS3XQJt2MPIRi6RqjuKpTSAnT8jJC1/hTxQpS+ZH906AkstKRlu/rTQ38G+gQnLj6I2JwD9Xwve5XNA4BWwvlJVF1rFju1KocAPGCTi1aXRPFh1RZj4V+e2zFlo0TnHIb95gs393eL0L5zR8RwSkNTNm8rIbuIQTRi6ANu2EoP1dWJw9DR+ujuzAtNniXwf7d1etGy3cjaBFK0N0xhKRCuA3n6RzZszvqTN06mJcxdjAUV9q+Nkn7dUnsbbTgbipt9EsFpFSnwP+CM3OEZpEuQ7qG7cPMgY3H5xKDM5FK+DE2ZBhiTcLDi+jluyAaw4UAsW+nlHjE28/MeBuIb21v1kKfA6VDoiIEnDFPuAeIbN7bLPg9UBZKSQlVa8bDSZPNwZ1k4iUAPhZqmp74BiQDPDpB8rUh40iXSP0zL62loqOKGdP19oUuXcIH+cbW4Q+IlIIAQ4AqOoKKo9rqjB6oJeC/JoVmnjD7YZthS6yevmpbhWRob5GcLC/SGVlFoFXV1o0TasfopHw9EwrkHwFzn2pH4YDIvInMNfX7pwpLFzhQhooKfUbKEyfa1B8M/i7QQi1ypuv7cAQn+ytl20WPVe/H3Iyewibdrlo3sIvOgjkioixNQzJlyJiA+MB//XqtNlW8EjUKbrfLKz/0iB/ARgVTB7COAAgIqeAe3E2egBMn2OxeJVVo+12bTB4qJNxWrfzi8qBESJyNJx+xGEVkR+A4QQ4MW6ixWd7jYwQN6SkwvOvWazZ7CKtuV9cijPyuyLyrM6wqt4CbAX8Y+LxwNplNktfsWPK7+AcYYc/JMxa6KJDR6PrHHC/iHxT1fNRDaWqtgXeAwYFysvLYONamw1rlAP7alYvWmXAiHEWj04RunQLoVEAjBGRE9XZiToWVNUFTAPmAc2C+/84Dnt22hTuhWO/KCd/h0sXHacap0DLdKFLt2ufWbNzBXfoNWYpsAB4rfKcEn+o6nWqulxVy+P4tf6qqr6jzu826geq2l5V56lqUQzEj6vqgliIx5xO1PkEeivO+sgDsoDrcX5IEggPztH1MLAH+Ar4vrLu1Bp1sklQVTeQBvhK0QXgSl3E9X8Vu91nE/qRyQAAAABJRU5ErkJggg==") 2x
      //                 ) 0 0, copy !important;
      //     }
      //     html.markup-dragging-pin, html.markup-dragging-pin body, html.markup-dragging-pin body * {
      //         cursor: grabbing !important;
      //     }
      //     </style>
      // `
      // )

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
