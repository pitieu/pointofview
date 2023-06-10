export default function def(host, userId) {
  console.log("jsFile loaded")
  let navigationEnabled = true
  let screenMode = "desktop"
  let clickCount = 0
  let pinElementDragged = null
  let isDragging = false
  let isCommenting = false
  let highlight
  let dragOver
  let pins = []

  function debounce(func, delay) {
    let debounceTimer
    return function () {
      const context = this
      const args = arguments
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  function getXPath(element) {
    if (element.tagName == "HTML") return "/HTML[1]"
    if (element === document.body) return "/HTML[1]/BODY[1]"

    let ix = 0
    let siblings = element.parentNode.childNodes
    for (let i = 0; i < siblings.length; i++) {
      let sibling = siblings[i]
      if (sibling === element)
        return (
          getXPath(element.parentNode) +
          "/" +
          element.tagName +
          "[" +
          (ix + 1) +
          "]"
        )
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++
    }
    return ""
  }

  function getElementByXPath(path) {
    return document.evaluate(
      path,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
  }

  function adjustPinDirection(pin) {
    let pinDirection = "bl"

    let left = parseInt(pin.left.replace("px", ""), 10)
    let top = parseInt(pin.top.replace("px", ""), 10)

    console.log(pin.index, pin.pinDirection)

    if (!pin.pinDirection) {
      // if (["tr", "tl"].indexOf(pin.pinDirection) > -1) {
      //   top -= 32
      // }
      // if (["br"].indexOf(pin.pinDirection) > -1) {
      //   left += 32
      // }
      if (left + 32 > window.innerWidth) {
        left -= 32
        pinDirection = "br"
        if (top - 32 < 0) {
          top += 32
          pinDirection = "tr"
        }
      } else if (top - 32 < 0) {
        top += 32
        pinDirection = "tl"
      }
      pin.pinDirection = pinDirection
    }

    pin.top = top + "px"
    pin.left = left + "px"

    return pin
  }

  function addCircle(pin) {
    let left = parseInt(pin.left.replace("px", ""), 10)
    let top = parseInt(pin.top.replace("px", ""), 10)

    const pinElement = $("<div></div>")
      .css({
        position: "absolute",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: pin.color || "#ef4444",
        border: "2px solid white",
        borderBottomLeftRadius: pin.pinDirection == "bl" ? "0px" : "50%",
        borderTopLeftRadius: pin.pinDirection == "tl" ? "0px" : "50%",
        borderBottomRightRadius: pin.pinDirection == "br" ? "0px" : "50%",
        borderTopRightRadius: pin.pinDirection == "tr" ? "0px" : "50%",
        fontWeight: 600,
        "font-size": "medium",
        "font-family": "ui-sans-serif, system-ui",
        color: "white",
        textAlign: "center",
        lineHeight: "1.75rem",
        userSelect: "none",
        zIndex: "1000",
        left: left + window.scrollX + "px",
        top: top + window.scrollY + "px",
      })
      .attr("draggable", userId === pin.ownerId ? "true" : "false")
      .attr("id", `pin-${screenMode}-${pin.index}`)
      .attr("data-pin-index", `${pin.index}`)
      .addClass(`m-pin m-pin-${pin.screenMode}`)

    pinElement.on("dragstart", function (e) {
      if (!isCommenting && !navigationEnabled && userId === pin.ownerId) {
        e.stopPropagation()
        pinElementDragged = pinElement
        pinElementDragged.addClass("m-pin-dragging")

        // overwrite dragged clone to position the bottom left to the cursor
        let clone = $(this).clone()
        clone.css({ opacity: 0.5, position: "absolute", top: 0, left: 0 })
        $("body").append(clone)
        e.originalEvent.dataTransfer.setDragImage(clone[0], 0, 32)
        // setTimeout required to allow setDragImage to replace clone
        setTimeout(() => {
          clone.remove()
        }, 0)
      }
    })

    pinElement.on("dragend", function (e) {
      e.stopPropagation()
      delete pinElementDragged.pinDirection
      updatePinPosition(pinElementDragged, e)
      if (pinElementDragged) pinElementDragged.removeClass("m-pin-dragging")
      pinElementDragged = null
      dragOver = null
      isDragging = false
      renderPins()
    })

    console.log(screenMode, pin.screenMode)
    if (screenMode != pin.screenMode) {
      pinElement.hide()
    }
    // const target = getElementByXPath(pin.xpath)

    $("body").append(pinElement.text(String(pin.index)))
    renderPins()
  }

  function deletePinByIndex(indexToRemove) {
    pins = pins.filter(function (pin) {
      return pin.index !== indexToRemove
    })
  }

  function pinExists(pinIndex) {
    return pins.some((existingPin) => existingPin.index === pinIndex)
  }

  function updateOutlinePos(event, highlight) {
    if (!highlight) {
      highlight = $(".m-element-highlight")
    }
    // move highlight to the target element
    const targetElement = $(dragOver || event.target)
    const rect = targetElement[0].getBoundingClientRect()
    const scrollTop = $(document).scrollTop()
    const scrollLeft = $(document).scrollLeft()
    highlight.css({
      display: "block",
      top: `${rect.top + scrollTop}px`,
      left: `${rect.left + scrollLeft}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
  }

  function addOutline() {
    highlight = $("<div></div>")
      .css({
        position: "absolute",
        outline: "1px dotted rgba(255, 0, 0, 0.5)",
        pointerEvents: "none",
      })
      .addClass("m-element-highlight m-element")
      .attr("id", "m-highlight")

    if (navigationEnabled) {
      highlight.addClass("hidden-s")
    }

    $("body").append(highlight)

    $("body").on("mouseover", function (event) {
      if (navigationEnabled) {
        highlight.hide()
      } else {
        updateOutlinePos(event, highlight)
        // move highlight to the target element
      }
    })

    $("body").on("mouseout", function () {
      highlight.css({
        width: "0px",
        height: "0px",
      })
    })
  }

  function findPin(pinIndexToFind) {
    return pins.find((pin) => pin.index === pinIndexToFind)
  }

  function updatePinPosition(element, e) {
    let pin = findPin(element.attr("data-pin-index"))

    pin.left = e.clientX - 1 + "px"
    pin.top = e.clientY - 32 + "px"
    pin = adjustPinDirection(pin)

    if (dragOver) {
      pin.xpath = getXPath(dragOver)
      pin.oldBounds = dragOver.getBoundingClientRect()
    } else {
      pin.xpath = getXPath(e.target)
      pin.oldBounds = e.target.getBoundingClientRect()
    }

    element.css({
      left: pin.left,
      top: pin.top,
    })
  }

  function addPins(newPins) {
    newPins.forEach((c) => {
      clickCount =
        clickCount < parseInt(c.index, 10) ? parseInt(c.index, 10) : clickCount
      if (!pinExists(c)) {
        c = adjustPinDirection(c)
        pins.push(c)
        addCircle(c)
      }
    })
  }

  function renderPins() {
    $(".m-pin").hide()
    $(`.m-pin-${screenMode}`).each((index, element) => {
      const el = $(element)
      const indexPin = el.attr("data-pin-index")
      let pin = findPin(indexPin)
      pin = adjustPinDirection(pin)
      const target = getElementByXPath(pin.xpath)
      if (target) {
        const rect = target.getBoundingClientRect()
        const oldLeft = parseInt(pin.left, 10)
        const oldTop = parseInt(pin.top, 10)
        const oldBounds = pin.oldBounds

        const bottom = rect.bottom - oldBounds.bottom
        const right = rect.right - oldBounds.right

        el.css({
          top: oldTop + bottom + window.scrollY,
          left: oldLeft + right + window.scrollX,
        })
      }
      el.show()
    })
  }

  // communicate with parent
  $(document).ready(function () {
    addOutline()

    $("*").scroll(function () {
      renderPins()
      // console.log("You're scrolling the page!")
    })

    window.parent.postMessage(
      {
        app: "custom",
        type: "url_changed",
        url: window.location.href,
      },
      host
    )

    // parent Messages
    window.addEventListener("message", (event) => {
      if (event.data.hasOwnProperty("app")) {
        console.log("received", event)
      }
      const originHost = new URL(event.origin).host
        .split(".")
        .slice(-1)
        .join(".")

      const hostHost = new URL(host).host?.split(".").slice(-1).join(".")

      if (originHost == hostHost) {
        if (event.data?.type == "addPin") {
          let pin = event.data.pin
          delete pin.pinDirection
          if (!pinExists(pin)) {
            pin = adjustPinDirection(pin)
            addPins([pin])
          }
          isCommenting = false
          document.body.style.overflow = "unset"
        }

        if (event.data?.type == "closeEditor") {
          clickCount--
          isCommenting = false
          document.body.style.overflow = "unset"
        }

        if (event.data?.type == "changeScreenMode") {
          screenMode = event.data?.screenMode
          renderPins()
        }

        if (event.data?.type == "data") {
          screenMode = event.data?.screenMode

          // add pins give from frontend
          if (event.data?.hasOwnProperty("pins")) {
            addPins(event.data.pins)
          }
        }

        if (event.data?.hasOwnProperty("navigationEnabled")) {
          navigationEnabled = event.data?.navigationEnabled
          if (navigationEnabled) {
            // hide add comment cursor
            $("html").removeClass("m-comment-mode")
            // hide outlines
            $(".m-element").addClass("hidden-s")
          } else {
            // show add comment cursor
            $("html").addClass("m-comment-mode")
            $(".hidden-s").removeClass("hidden-s")
          }
        }
      }
    })
  })

  document.addEventListener(
    "click",
    function (event) {
      setTimeout(() => {
        renderPins()
      }, 0)
      if (!navigationEnabled) {
        event.preventDefault()
      }
    },
    true
  )
  // // prevent a link navigation
  // $("*").on("click", function (event) {
  //   console.log("click", navigationEnabled)
  //   if (!navigationEnabled) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  // })

  // add new pin
  $(document).on("mousedown", function (e) {
    if (
      !pinElementDragged &&
      !isDragging &&
      !isCommenting &&
      !navigationEnabled &&
      !$(e.target).hasClass("m-pin")
    ) {
      isCommenting = true
      document.body.style.overflow = "hidden"

      clickCount++
      const rect = e.target.getBoundingClientRect()

      window.parent.postMessage(
        {
          app: "custom",
          type: "add_pin",
          xPath: getXPath(e.target),
          url: window.location.href,
          pin: {
            oldBounds: rect,
            parentLeft: e.originalEvent.x,
            parentTop: e.originalEvent.y,
            left: e.clientX - 1 + "px",
            top: e.clientY - 32 + "px",
            text: String(clickCount),
          },
          editor: {
            parentLeft: e.originalEvent.x,
            parentTop: e.originalEvent.y,
            left: e.clientX + 40 + "px",
            top: e.clientY - 32 + "px",
          },
          url: window.location.href,
          screenMode: screenMode,
          ownerId: userId,
        },
        host
      )
    }
  })

  // redraw pins
  $(window).resize(function () {
    renderPins()
  })

  // redraw outline
  $(document).on("dragover", function (e) {
    dragOver = e.target
    updateOutlinePos(e)
  })
}
