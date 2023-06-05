export default function def(host) {
  console.log("iframe loading", host)

  var preventNavigation = false
  try {
    window.onload = function () {
      console.log("iframe loaded with host", host)
      // send current page
      window.parent.postMessage(
        {
          type: "url_changed",
          url: window.location.href,
        },
        host
      )
      // listen to events from parent
      window.addEventListener("message", (event) => {
        const originHost = new URL(event.origin).host
        const hostHost = new URL(host).host?.split(".").slice(-1).join(".")
        console.log(originHost, hostHost)
        if (originHost == hostHost) {
          console.log(event.data)
          if (event.data?.type == "preventNavigation") {
            preventNavigation = event.data?.value
            console.log(preventNavigation)
            if (preventNavigation) {
              var elements = document.querySelectorAll(".hidden-s")
              for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("hidden-s")
              }
            } else {
              var elements = document.querySelectorAll(".apov-test")
              for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add("hidden-s")
              }
            }
          }
        }
      })

      const overlay = document.createElement("div")
      overlay.style.position = "absolute"
      overlay.style.top = "0"
      overlay.style.left = "0"
      overlay.style.width = "200px"
      overlay.style.height = "200px"
      overlay.style.backgroundColor = "#FF0000"
      overlay.style.zIndex = "1000"
      overlay.classList.add("apov-test")
      // document.body.style.backgroundColor = "#FF0000"
      document.body.appendChild(overlay)

      // prevent a link navigation
      document.body.addEventListener("click", function (event) {
        if (preventNavigation) {
          event.preventDefault()
        }
      })

      const highlight = document.createElement("div")
      highlight.style.position = "absolute"
      highlight.style.outline = "1px dotted rgba(255, 0, 0, 0.5)" // semi-transparent red
      highlight.style.pointerEvents = "none" // allows mouse events to pass through to elements below
      highlight.classList.add("m-element-highlight", "apov-test")
      document.body.appendChild(highlight)

      document.body.addEventListener("mouseover", function (event) {
        const targetElement = event.target as HTMLElement

        const rect = targetElement.getBoundingClientRect()
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        const scrollLeft =
          document.documentElement.scrollLeft || document.body.scrollLeft

        highlight.style.top = `${rect.top + scrollTop}px`
        highlight.style.left = `${rect.left + scrollLeft}px`
        highlight.style.width = `${rect.width}px`
        highlight.style.height = `${rect.height}px`
      })

      document.body.addEventListener("mouseout", function (event) {
        // Hide the highlight
        highlight.style.width = "0"
        highlight.style.height = "0"
      })
    }
  } catch (e) {
    console.log(e)
  }
}
