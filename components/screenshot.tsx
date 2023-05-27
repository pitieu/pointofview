"use client"

import { useEffect, useState } from "react"

export const WebScreenshot = ({ data }) => {
  return (
    <div>
      {!data ? (
        <p>Loading...</p>
      ) : (
        <img src={`data:image/png;base64,${data}`} />
      )}
    </div>
  )
}
