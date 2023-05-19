import { zodResolver } from "@hookform/resolvers/zod"
import { useForm as useReactHookForm, type UseFormProps } from "react-hook-form"
import { type z } from "zod"

export const useForm = <S extends z.ZodTypeAny, TContext = any>(
  schema: S,
  props: UseFormProps<z.infer<S>, TContext>
) => {
  const formProps = useReactHookForm<z.infer<S>>({
    resolver: zodResolver(schema),
    ...props,
  })
  return formProps
}
export default useForm
