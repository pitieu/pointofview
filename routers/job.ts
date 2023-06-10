import {
  addJobCommentSchema,
  fetchMyJobSchema,
  jobCommentSchema,
  jobSchema,
} from "@/schema/job.schema"
import {
  addCommentHandler,
  createJobHandler,
  deleteMyJobHandler,
  fetchCommentsHandler,
  fetchMyJobHandler,
  listMyJobHandler,
} from "@/trpc-api/job.api"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

export const jobRouter = createTRPCRouter({
  add: protectedProcedure.input(jobSchema).mutation(createJobHandler),
  myJob: createTRPCRouter({
    list: protectedProcedure
      .input(z.object({ published: z.boolean().optional() }))
      .query(listMyJobHandler),
    fetch: protectedProcedure.input(fetchMyJobSchema).query(fetchMyJobHandler),
    delete: protectedProcedure
      .input(fetchMyJobSchema)
      .mutation(deleteMyJobHandler),
  }),

  comments: createTRPCRouter({
    list: protectedProcedure
      .input(fetchMyJobSchema)
      .query(fetchCommentsHandler),
    add: protectedProcedure
      .input(addJobCommentSchema)
      .mutation(addCommentHandler),
  }),
})
