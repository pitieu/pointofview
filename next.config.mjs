import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  swcMinify: true,
}

export default withContentlayer(nextConfig)
