// src/Markdown.ts

import MarkdownIt from "markdown-it"
import { API } from "@editorjs/editorjs"

interface MarkdownToolData {
  text: string
}

interface MarkdownToolConfig {
  // Add any custom configuration properties here
}

class MarkdownTool {
  private api: API
  private data: MarkdownToolData
  private config: MarkdownToolConfig
  private wrapper: HTMLElement | null
  private textarea: HTMLTextAreaElement
  private preview: HTMLElement
  private markdownIt: MarkdownIt

  static get toolbox() {
    return {
      icon: '<i class="icon-markdown"></i>',
      title: "Markdown",
    }
  }

  constructor({
    data,
    api,
    config,
  }: {
    data: MarkdownToolData
    api: API
    config: MarkdownToolConfig
  }) {
    this.api = api
    this.data = data || { text: "" }
    this.config = config || {}
    this.wrapper = null
    this.markdownIt = new MarkdownIt()
  }

  render(): HTMLElement {
    this.wrapper = document.createElement("div")
    this.wrapper.classList.add("markdown-editor")

    this.textarea = document.createElement("textarea")
    this.textarea.classList.add("w-full")
    this.wrapper.appendChild(this.textarea)

    if (this.data.text) {
      this.textarea.value = this.data.text
    }

    this.textarea.addEventListener("input", () => {
      this.updatePreview()
    })

    this.preview = document.createElement("div")
    this.preview.classList.add("markdown-preview")
    this.wrapper.appendChild(this.preview)

    this.updatePreview()

    return this.wrapper
  }

  private updatePreview(): void {
    if (!this.preview) {
      return
    }
    this.preview.innerHTML = this.markdownIt.render(this.textarea.value)
  }

  save(blockContent: HTMLElement): MarkdownToolData {
    return {
      text: blockContent.querySelector("textarea")!.value,
    }
  }
}

export default MarkdownTool
