import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, Coffee } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Elevate Your Website
            <span className="mt-[-0.1em] block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text leading-relaxed text-transparent">
              Skyrocket Your Growth
            </span>
          </h1>

          <p className="max-w-[42rem] font-sans leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Join our platform to get your website reviewed and elevate your user
            experience, drive conversions, and supercharge your growth.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "font-mono font-semibold"
              )}
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How does it work?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Very simple without too much hassle you can get your website
            reviewed by our community of experts.
          </p>
        </div>

        {/*  */}
        <div className="mx-auto flex items-center justify-between align-middle md:max-w-[64rem] ">
          <div className="relative min-h-[size] flex-grow overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex flex-col justify-between space-y-4 rounded-md p-6">
              <Coffee size={48} className="mx-auto mb-2 text-sky-500" />
              <h3 className="text-center font-bold">1. Request Feedback</h3>
              <p className="text-center text-sm text-muted-foreground">
                Submit one or more urls to get feedback from.
              </p>
            </div>
          </div>
          <ArrowRight color="gray" size={48} className="mx-4" />
          <div className="relative min-h-[size] flex-grow overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex flex-col justify-between space-y-4 rounded-md p-6">
              <Clock size={48} className="mx-auto mb-2 text-rose-500" />
              <h3 className="text-center font-bold">2. Wait</h3>
              <p className="text-center text-sm text-muted-foreground">
                Our community will review and give you feedback.
              </p>
            </div>
          </div>
          <ArrowRight color="gray" size={48} className="mx-4" />
          <div className="relative min-h-[size] max-w-[300px] flex-grow overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex flex-col justify-between space-y-4 rounded-md p-6">
              <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
              <h3 className="text-center font-bold">3. Complete</h3>
              <p className="text-center text-sm text-muted-foreground">
                Review feedback, improve your pages and repeat the process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
