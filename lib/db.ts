import { PrismaClient } from "@prisma/client"

declare global {
  namespace NodeJS {
    interface Global {
      cachedPrisma: PrismaClient
    }
  }
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    console.log("New PrismaClient connection")
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
