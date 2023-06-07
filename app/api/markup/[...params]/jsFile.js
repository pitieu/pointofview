export default function def(host, userId) {
  console.log("jsFile loaded")
  let navigationEnabled = true
  let screenMode = "desktop"
  let clickCount = 0
  let pinElementDragged = null
  let isDragging = false
  let isCommenting = false
  let pins = {
    desktop: [],
    tablet: [],
    mobile: [],
  }

  function getXPath(element) {
    if (!element) return ""
    if (element.id && element.id !== "") {
      return '//*[@id="' + element.id + '"]'
    }
    if (element === document.body) {
      return element.tagName.toLowerCase()
    }
    var ix = 0,
      count = 0
    var siblings = element.parentNode ? element.parentNode.childNodes : []
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i]
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        count++
        if (sibling === element) {
          ix = count
        }
      }
    }
    return (
      getXPath(element.parentNode) +
      "/" +
      element.tagName.toLowerCase() +
      (count > 1 ? "[" + ix + "]" : "")
    )
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

  function addCircle(pin) {
    const pinElement = $("<div></div>").css({
      position: "absolute",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: pin.color || "#ef4444",
      border: "2px solid white",
      borderBottomLeftRadius: "0px",
      fontWeight: 600,
      "font-size": "medium",
      "font-family": "ui-sans-serif, system-ui",
      color: "white",
      textAlign: "center",
      lineHeight: "1.75rem",
      userSelect: "none",
      zIndex: "1000",
      left: pin.left,
      top: pin.top,
    })

    pinElement.on("mousedown", function (e) {
      e.preventDefault()
      if (!isCommenting && !navigationEnabled && userId === pin.ownerId) {
        isDragging = true
        pinElementDragged = pinElement
        pinElementDragged.addClass("m-pin-dragging")
      }
    })

    pinElement.addClass(`m-pin m-pin-${pin.screenMode}`)
    pinElement.attr("id", `pin-${screenMode}-${pin.index}`)
    pinElement.attr("data-ownerId", `${pin.ownerId}`)
    pinElement.attr("data-xpath", `${pin.xpath}`)
    pinElement.attr("data-left", `${pin.left}`)
    pinElement.attr("data-top", `${pin.top}`)
    pinElement.attr("data-window-width", `${pin.windowWidth}`)
    pinElement.attr("data-window-height", `${pin.windowHeight}`)

    if (screenMode != pin.screenMode) {
      pinElement.hide()
    }
    $("body").append(pinElement.text(String(pin.index)))
  }

  function deletePinByIndex(indexToRemove) {
    for (let mode in pins) {
      pins[mode] = pins[mode].filter(function (pin) {
        console.log(pin.index, indexToRemove, mode)
        return pin.index !== indexToRemove
      })
    }
  }

  function pinExists(pinIndex) {
    for (let mode in pins) {
      let pinExists = pins[mode].some(
        (existingPin) => existingPin.index === pinIndex
      )

      if (pinExists) {
        return true
      }
    }
    return false
  }

  function addOutline() {
    const highlight = $("<div></div>")
      .css({
        position: "absolute",
        outline: "1px dotted rgba(255, 0, 0, 0.5)",
        pointerEvents: "none",
      })
      .addClass("m-element-highlight m-element hidden-s")

    $("body").append(highlight)

    $("body").on("mouseover", function (event) {
      if (navigationEnabled) {
        highlight.hide()
      } else {
        // move highlight to the target element
        const targetElement = $(event.target)
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
    })

    $("body").on("mouseout", function () {
      highlight.css({
        width: "0px",
        height: "0px",
      })
    })
  }

  function addPins(pins) {
    $("m-pin").hide()
    pins.forEach((c) => {
      clickCount =
        clickCount < parseInt(c.index, 10) ? parseInt(c.index, 10) : clickCount

      if (!pinExists(c)) {
        pins[c.screenMode].push(c)
        addCircle(c)
      }
    })
  }

  function renderPins() {
    // console.log("render pins", screenMode)
    // $(".m-pin").hide()
    $(`.m-pin-${screenMode}`).each((index, element) => {
      const el = $(element)
      const target = getElementByXPath(el.attr("data-xpath"))
      // console.log(target, el.attr("data-xpath"), el)
      if (target) {
        const rect = target.getBoundingClientRect()
        const windowHeight = parseInt(el.attr("data-window-height"), 10)
        const windowWidth = parseInt(el.attr("data-window-width"), 10)
        console.log(
          rect.top,
          windowHeight,
          window.innerHeight,
          parseInt(el.attr("data-top"), 10)
        )
        console.log(
          rect.left,
          windowWidth,
          window.innerWidth,
          parseInt(el.attr("data-left"), 10)
        )
        el.css({
          top:
            parseInt(el.attr("data-top"), 10) *
            (window.innerHeight / windowHeight),
          left:
            parseInt(el.attr("data-left"), 10) *
            (window.innerWidth / windowWidth),
        }).show()
      }
    })
  }

  $(document).ready(function () {
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
          const pin = event.data.pin
          if (!pinExists(pin)) {
            pins[pin.screenMode].push(pin)
            addCircle(pin)
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

  // prevent a link navigation
  $("*").on("click", function (event) {
    // console.log("navigationEnabled", navigationEnabled)
    if (!navigationEnabled) {
      event.preventDefault()
    }
  })

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
      console.log(e.target)
      window.parent.postMessage(
        {
          app: "custom",
          type: "add_pin",
          xPath: getXPath(e.target),
          url: window.location.href,
          pin: {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            parentLeft: e.originalEvent.x,
            parentTop: e.originalEvent.y,
            left: e.pageX - 1 + "px",
            top: e.pageY - 32 + "px",
            text: String(clickCount),
          },
          editor: {
            parentLeft: e.originalEvent.x,
            parentTop: e.originalEvent.y,
            left: e.pageX + 40 + "px",
            top: e.pageY - 32 + "px",
          },
          url: window.location.href,
          screenMode: screenMode,
          ownerId: userId,
        },
        host
      )

      // clickCount++
      // addCircle({
      //   index: String(clickCount),
      //   left: e.pageX - 1 + "px",
      //   top: e.pageY - 32 + "px",
      //   text: String(clickCount),
      //   url: window.location.href,
      //   screenMode: screenMode,
      //   ownerId: userId,
      // })
      // addEditor({
      //   left: e.pageX + 40 + "px",
      //   top: e.pageY - 32 + "px",
      // })
    }
  })

  $(window).resize(function () {
    // This code will be executed whenever the window is resized
    // console.log("The window was resized");
    renderPins()
  })

  $(document).on("mousemove", function (e) {
    if (pinElementDragged === null) return
    pinElementDragged.css({
      left: e.pageX - 15 + "px",
      top: e.pageY - 15 + "px",
    })
  })

  $(document).on("mouseup", function () {
    if (pinElementDragged) pinElementDragged.removeClass("m-pin-dragging")
    pinElementDragged = null
    isDragging = false
  })

  addOutline()
}
