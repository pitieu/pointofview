import { FC } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { AddWebsiteModal } from "@/components/modals/add-website-modal"

import { Button } from "./ui/button"

interface portfolioListProps {}

const PortfolioList: FC<portfolioListProps> = ({}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolios</CardTitle>
        <CardDescription>
          Show proof of your successes to give you more credibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <AddWebsiteModal />
          <Button
            variant="ghost"
            className="flex h-[150px] w-[150px] flex-col gap-4 rounded-lg border-2 border-gray-200"
          >
            <Icons.youtube width={48} height={48} strokeWidth={1} />
            Youtube Channel
          </Button>
          <Button
            variant="ghost"
            className="flex h-[150px] w-[150px] flex-col gap-4 rounded-lg border-2 border-gray-200"
          >
            <Icons.twitter width={48} height={48} strokeWidth={1} />
            Twitter
          </Button>
          <Button
            variant="ghost"
            className="flex h-[150px] w-[150px] flex-col gap-4 rounded-lg border-2 border-gray-200"
          >
            <Icons.instagram width={48} height={48} strokeWidth={1} />
            Instagram
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PortfolioList
