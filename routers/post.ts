import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

import {
  searchProductDetailsHandler,
  generateAIPostHandler,
} from "@/trpc-api/post.api"
import { postTypeSchema, productSchema } from "@/schema/post.schema"

export const postRouter = createTRPCRouter({
  generateAIPost: protectedProcedure
    .input(postTypeSchema)
    .mutation(generateAIPostHandler),
  searchProductDetails: protectedProcedure
    .input(productSchema)
    .mutation(searchProductDetailsHandler),
})
