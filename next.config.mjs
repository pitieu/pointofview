import * as dotenv from "dotenv"
import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

dotenv.config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    config.module.rules.push({
      test: /\.map$/,
      use: {
        loader: "ignore-loader",
      },
    })
    config.resolve.alias.encoding = "encoding"
    return config
  },
  async rewrites() {
    return [
      // Rewrite rule for subdomains
      {
        source: "/:path*",
        destination: "/api/markup/:path*",
        has: [
          {
            type: "host",
            value: `(.*).p.${new URL(process.env.NEXT_PUBLIC_APP_URL).host}`,
          },
        ],
      },
      {
        source: "/",
        destination: "/api/markup/",
        has: [
          {
            type: "host",
            value: `(.*).p.${new URL(process.env.NEXT_PUBLIC_APP_URL).host}`,
          },
        ],
      },
    ]
  },
  // reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      new URL(process.env.SUPABASE_URL).hostname,
    ],
  },
  experimental: {
    serverActions: true,
    // serverComponentsExternalPackages: ["@prisma/client"],
    esmExternals: false,
  },
  // swcMinify: true,
}

export default withContentlayer(nextConfig)
