import { headers } from "next/headers"

import Markup from "./markup"

export default async function MarkupPage() {
  const headersList = headers()
  const myHost = headersList.get("host")
  return <div>{myHost && <Markup host={myHost} id="123" />}</div>
}
