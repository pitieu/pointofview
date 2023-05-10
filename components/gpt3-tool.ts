import {
  API,
  BlockTool,
  BlockToolConstructorOptions as BaseBlockToolConstructorOptions,
} from "@editorjs/editorjs"
import { editorjsTools } from "./icons"
import { openaiCompletion } from "@/lib/openai"
import { trpc } from "@/lib/trpc"

interface AiParagraphToolConfig {
  getContent: () => Promise<any>
}
interface BlockToolConstructorOptions extends BaseBlockToolConstructorOptions {
  api: API
  config?: AiParagraphToolConfig
  readOnly: boolean
  placeholder?: string
  preserveBlank?: boolean
}

function extractTextFromEditorContent(content: any): string {
  if (!content || !content.blocks) {
    return ""
  }

  return content.blocks
    .map((block: any) => {
      switch (block.type) {
        case "paragraph":
        case "header":
        case "aiParagraph":
          return block.data.text

        case "list":
          return block.data.items.join("\n")

        case "code":
          return block.data.code

        case "inlineCode":
          return block.data.text

        case "table":
          return block.data.content
            .map((row: any) => row.map((cell: any) => cell.text).join("\t"))
            .join("\n")

        case "linkTool":
          return block.data.link

        // For embeds, you might want to return the URL or an empty string, depending on your requirements
        case "embed":
          return ""

        default:
          return ""
      }
    })
    .join("\n")
}

export class AiParagraphTool implements BlockTool {
  private api: API
  private config: AiParagraphToolConfig
  private readOnly: boolean
  private defaultData: any
  private _placeholder: string
  private _data: any
  private _element: HTMLElement
  private _preserveBlank: boolean
  private initialized: boolean

  constructor(options: BlockToolConstructorOptions) {
    this.api = options.api
    this.config = options.config || { getContent: async () => ({}) }
    this.readOnly = options.readOnly || false

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this)
    }

    this._placeholder = options.placeholder || ""
    this._data = {}
    this._element = this.drawView()
    this._preserveBlank =
      options.preserveBlank !== undefined ? options.preserveBlank : false

    this.data = options.data
    this.defaultData = options.data
    this.initialized = false
  }

  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete") {
      return
    }

    const { textContent } = this._element

    if (textContent === "") {
      this._element.innerHTML = ""
    }
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = document.createElement("DIV")

    div.classList.add("ce-paragraph", "cdx-block")
    div.contentEditable = "false"
    div.dataset.placeholder = this.api.i18n.t(this._placeholder)

    return div
  }

  render() {
    if (!this.data.text && this.initialized == false) {
      this.initialized = true
      const callLLM = async () => {
        const currentIndex = this.api.blocks.getCurrentBlockIndex()
        const editorContent = await this.config.getContent()
        const slicedContent = {
          ...editorContent,
          blocks: editorContent.blocks.slice(0, currentIndex + 1),
        }
        const editorContentText = extractTextFromEditorContent(slicedContent)

        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editorContentText,
          }),
        })
        const result = await response.text()
        this._data.text = result
        this._element.innerText = result || ""
        if (this.readOnly) {
          this._element.contentEditable = "true"
          this._element.addEventListener("keyup", this.onKeyUp)
        }
      }
      callLLM()
      this._element.contentEditable = "false"
      this._element.innerHTML = "Loading..."
    } else {
      this._element.contentEditable = "true"
    }
    return this._element
  }

  merge(data) {
    let newData = {
      text: this.data.text + data.text,
    }

    this.data = newData
  }

  validate(savedData) {
    if (savedData.text.trim() === "" && !this._preserveBlank) {
      return false
    }

    return true
  }

  save(paragraph: HTMLElement) {
    return {
      text: paragraph.innerText,
    }
  }

  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML,
    }

    this.data = data
  }

  static get conversionConfig() {
    return {
      export: "text", // to convert Paragraph to other block, use 'text' property of saved data
      import: "text", // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    }
  }

  static get sanitize() {
    return {
      text: {
        br: true,
      },
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  get data() {
    let text = this._element.innerHTML

    this._data.text = text

    return this._data
  }

  set data(data) {
    this._data = data || {}

    this._element.innerHTML = this._data.text || ""
  }

  static get pasteConfig() {
    return {
      tags: ["P"],
    }
  }

  static get toolbox() {
    return {
      title: "AI Paragraph",
      icon: editorjsTools.paragraph,
    }
  }
}
