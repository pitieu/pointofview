import { fetchMyJobSchema, jobSchema } from "@/schema/job.schema"
import {
  createJobHandler,
  deleteMyJobHandler,
  fetchMyJobHandler,
  listMyJobHandler,
} from "@/trpc-api/job.api"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

export const jobRouter = createTRPCRouter({
  createJob: protectedProcedure.input(jobSchema).mutation(createJobHandler),
  listMyJobHandler: protectedProcedure
    .input(z.object({ published: z.boolean().optional() }))
    .query(listMyJobHandler),
  fetchMyJobHandler: protectedProcedure
    .input(fetchMyJobSchema)
    .query(fetchMyJobHandler),
  deleteMyJobHandler: protectedProcedure
    .input(fetchMyJobSchema)
    .mutation(deleteMyJobHandler),
})
