/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  eslint: {
    // Don't fail builds on ESLint warnings
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig
