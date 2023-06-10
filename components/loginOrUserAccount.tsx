import React from "react"
import Link from "next/link"
import { User } from "@prisma/client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAccountNav } from "@/components/navigation/user-account-nav"

export default function LoginOrUserAccount({
  user,
}: {
  user: User | undefined
}) {
  return (
    <>
      {!user ? (
        <nav>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4"
            )}
          >
            Login
          </Link>
        </nav>
      ) : (
        <UserAccountNav
          user={{
            name: user.name,
            image: user.image,
            email: user.email,
          }}
        />
      )}
    </>
  )
}
