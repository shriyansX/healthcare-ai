/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://medintel-ai-production.up.railway.app',
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
