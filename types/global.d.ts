export {}

declare global {
  /**
   * @see https://stackoverflow.com/a/59774743
   */
  type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
    ...args: any
  ) => Promise<infer R>
    ? R
    : any

  type DeepNonNullable<T> = {
    [P in keyof T]-?: NonNullable<T[P]>
  } & NonNullable<T>

  type Prettify<T> = {
    [K in keyof T]: T[K]
  } & {}
}
