import { jobSchema } from "@/schema/job.schema"
import { createJobHandler } from "@/trpc-api/job.api"

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/app/api/trpc/trpc-router"

export const jobRouter = createTRPCRouter({
  createJob: protectedProcedure.input(jobSchema).mutation(createJobHandler),
})
