import { urlPattern } from "@/utils/string"
import { TypeOf, z } from "zod"

const CustomUrl = z.string().refine((value) => urlPattern.test(value), {
  message: "Invalid URL. Make sure to include www. at the start of the url.",
})

export type MarkupSchemaType = TypeOf<typeof markupSchema>

export const markupSchema = z.object({
  url: CustomUrl,
})
