import { User } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (Object.keys(session?.user || {}).length === 0) return undefined
  return session?.user as User
}
