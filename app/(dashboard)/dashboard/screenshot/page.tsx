import { WebScreenshot } from "@/components/screenshot"

export const metadata = {
  title: "Screenshot",
}

export default async function ScreenshotPage() {
  const url = "https://lifegoeson360.online/"
  const response = await fetch(
    `http://localhost:3000/api/screenshot?url=${encodeURIComponent(url)}`
  )
  const result = await response.json()

  return (
    <div>
      <WebScreenshot data={result} />
    </div>
  )
}
