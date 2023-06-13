import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  console.log(
    "New PrismaClient connection is cached?",
    !!globalForPrisma.prisma
  )
  if (!globalForPrisma.prisma) {
    prisma = new PrismaClient()
  } else {
    prisma = globalForPrisma.prisma
  }
}

export const db = prisma
