import * as z from "zod"

export const userAccountSchema = z.object({
  name: z.string().min(3).max(32),
  username: z.string().min(3).max(32),
})

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})

export const socialNetworkSchema = z.object({
  socialNetworks: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      url: z.string().min(3).max(255),
    })
    .array(),
})
