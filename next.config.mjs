import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

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
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
    esmExternals: false,
  },
  swcMinify: true,
}

export default withContentlayer(nextConfig)
