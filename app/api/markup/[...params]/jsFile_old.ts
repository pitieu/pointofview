export default function def(host) {
  console.log("iframe loading", host)

  var navigationEnabled = true
  var screenMode = "desktop"
  try {
    window.onload = function () {
      console.log("iframe loaded with host", host)
      // send current page and get current state back from parent
      window.parent.postMessage(
        {
          type: "url_changed",
          url: window.location.href,
        },
        host
      )

      // listen to events from parent
      window.addEventListener("message", (event) => {
        if (event.data.app === "custom") {
          console.log(event)
        }
        const originHost = new URL(event.origin).host
          .split(".")
          .slice(-1)
          .join(".")
        const hostHost = new URL(host).host?.split(".").slice(-1).join(".")
        if (originHost == hostHost) {
          if (event.data?.type == "data") {
            screenMode = event.data?.screenMode
          }

          if (event.data?.type == "navigationEnabled") {
            navigationEnabled = event.data?.value
            if (navigationEnabled) {
              // hide add comment cursor
              document.documentElement.classList.remove("m-comment-mode")
              // hide outlines
              var elements = document.querySelectorAll(".m-element")
              for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add("hidden-s")
              }
            } else {
              // show add comment cursor
              document.documentElement.classList.add("m-comment-mode")
              var elements = document.querySelectorAll(".hidden-s")
              for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("hidden-s")
              }
            }
          }
        }
      })

      // prevent a link navigation
      document.body.addEventListener("click", function (event) {
        if (!navigationEnabled) {
          event.preventDefault()
        }
      })
      let clickCount = 0
      let draggable = null
      let isDragging = false
      let isCommenting = false

      // adds Circle and Editor
      document.addEventListener("mousedown", function (e) {
        if (!draggable && !isDragging && !isCommenting && !navigationEnabled) {
          isCommenting = true
          clickCount++

          const circle = document.createElement("div")

          circle.style.position = "absolute"
          circle.style.width = "30px"
          circle.style.height = "30px"
          circle.style.borderRadius = "50%"
          circle.style.backgroundColor = "red"
          circle.style.border = "2px solid white"
          circle.style.fontWeight = "bold"
          circle.style.color = "white"
          circle.style.textAlign = "center"
          circle.style.lineHeight = "30px"
          circle.style.userSelect = "none"

          circle.style.left = e.pageX - 12 + "px" // subtract half the width/height to center the circle
          circle.style.top = e.pageY + 13 + "px"

          circle.textContent = String(clickCount)
          circle.classList.add("m-pin")

          circle.addEventListener("mousedown", function (e) {
            e.preventDefault()
            if (!isCommenting && !navigationEnabled) {
              isDragging = true
              draggable = circle
              draggable.classList.add("m-pin-dragging")
            }
          })

          document.body.appendChild(circle)

          // ******
          // EDITOR
          // ******
          const editorContainer = document.createElement("div")
          editorContainer.style.position = "absolute"
          editorContainer.style.left = e.pageX + 25 + "px" // position it to the right of the circle
          editorContainer.style.top = e.pageY + 10 + "px"
          editorContainer.style.padding = "8px"
          editorContainer.style.backgroundColor = "white"
          editorContainer.style.border = "1px solid #F0F0F0"
          editorContainer.style.borderRadius = "6px"
          editorContainer.style.cursor = "auto"
          editorContainer.style.boxShadow =
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          editorContainer.style.width = "350px" // adjust as needed
          editorContainer.id = "editorContainer" + clickCount // give it a unique id

          // editorContainer.style.height = "250px" // adjust as needed
          editorContainer.classList.add("editor")

          // Create and position the Quill editor
          const editor = document.createElement("div")
          editor.style.width = "100%" // adjust as needed
          editor.style.height = "150px" // adjust as needed
          editor.style.border = "1px solid #ccc"
          editor.style.borderTopWidth = "0px"
          editor.id = "editor" + clickCount // give it a unique id

          editorContainer.appendChild(editor)

          // Create and position the Save button
          const saveButton = document.createElement("button")
          saveButton.textContent = "Save"
          saveButton.style.backgroundColor = "#0f172a"
          saveButton.style.borderRadius = "6px"
          saveButton.style.color = "#FFF"

          saveButton.style.borderWidth = "0px"
          saveButton.style.padding = "8px 16px"
          saveButton.style.marginTop = "8px"
          saveButton.style.cursor = "pointer"

          saveButton.onclick = function () {
            // Save the Quill editor content here
            isCommenting = false
            editorContainer.style.display = "none"
          }
          editorContainer.appendChild(saveButton)

          document.body.appendChild(editorContainer)

          const quill = new Quill("#" + editor.id, {
            theme: "snow",
            placeholder: "Write your comment here...",
            modules: {
              toolbar: [
                ["bold", "italic", "underline", "strike"], // toggled buttons
                ["link"],
                [{ list: "ordered" }, { list: "bullet" }],
              ],
            },
          })
          setTimeout(() => {
            quill.focus()
          }, 200)
        }
      })

      document.addEventListener("mousemove", function (e) {
        if (draggable === null) return
        draggable.style.left = e.pageX - 15 + "px"
        draggable.style.top = e.pageY - 15 + "px"
      })

      document.addEventListener("mouseup", function () {
        draggable.classList.remove("m-pin-dragging")
        draggable = null
        isDragging = false
      })

      const highlight = document.createElement("div")
      highlight.style.position = "absolute"
      highlight.style.outline = "1px dotted rgba(255, 0, 0, 0.5)" // semi-transparent red
      highlight.style.pointerEvents = "none" // allows mouse events to pass through to elements below
      highlight.classList.add("m-element-highlight", "m-element", "hidden-s")
      document.body.appendChild(highlight)

      document.body.addEventListener("mouseover", function (event) {
        if (navigationEnabled) {
          highlight.style.display = "none"
        } else {
          const targetElement = event.target as HTMLElement

          const rect = targetElement.getBoundingClientRect()
          const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop
          const scrollLeft =
            document.documentElement.scrollLeft || document.body.scrollLeft

          highlight.style.display = "block"
          highlight.style.top = `${rect.top + scrollTop}px`
          highlight.style.left = `${rect.left + scrollLeft}px`
          highlight.style.width = `${rect.width}px`
          highlight.style.height = `${rect.height}px`
        }
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
