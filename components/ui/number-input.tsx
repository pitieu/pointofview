import * as React from "react"
import { numberWithCommas } from "@/utils/number-helpers"
import { NumberInput, NumberInputProps } from "@mantine/core"

import { cn } from "@/lib/utils"
import { useFormField } from "@/components/form-components/frm"

type Props = NumberInputProps & {
  format?: "default" | "delimited"
}

const NumberInputWrapper = React.forwardRef<HTMLInputElement, Props>(
  ({ className, format = "delimited", ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField()
    const { parser, formatter } = React.useMemo(() => {
      switch (format) {
        case "delimited":
          return {
            parser: (value?: string) =>
              (value && value.replace(/\$\s?|(,*)/g, "")) || "",
            formatter: (value?: string) => numberWithCommas(value),
          }
        default: {
          return {
            parser: undefined,
            formatter: undefined,
          }
        }
      }
    }, [format])
    return (
      <NumberInput
        ref={ref}
        parser={parser}
        formatter={formatter}
        id={formItemId}
        className={cn(
          "",
          error && "border-red-500 focus-visible:outline-red-500",
          className
        )}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)

NumberInputWrapper.displayName = "NumberInput"

export { NumberInputWrapper }
