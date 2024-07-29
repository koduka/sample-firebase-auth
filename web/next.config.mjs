/** @type {import('next').NextConfig} */

const WEB_BASE_URL = process.env.WEB_BASE_URL || 'localhost:300'

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
