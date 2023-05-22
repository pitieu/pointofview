import React from "react"
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

type FormProps<TFieldValues extends FieldValues> = {
  id?: string
  className?: string
  form: UseFormReturn<TFieldValues>
  children?: React.ReactNode
  onSubmit?: SubmitHandler<TFieldValues>
  onError?: SubmitErrorHandler<TFieldValues>
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  id,
  form,
  className,
  children,
  onSubmit,
  onError,
}: FormProps<TFieldValues>) {
  const handleError: SubmitErrorHandler<TFieldValues> = (errors, e) => {
    onError?.(errors, e)
    Object.entries(errors).forEach(([key, value]) =>
      console.warn(`${key}: Form validation: ${value?.message}`, { value })
    )
  }

  const handleSubmit = onSubmit
    ? form.handleSubmit(onSubmit, handleError)
    : (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()

  return (
    <FormProvider {...form}>
      <form id={id} onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}
