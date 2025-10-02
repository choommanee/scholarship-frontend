/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Enable standalone output for production deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080/api/v1',
  },
  images: {
    domains: ['localhost', 'railway.app'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Disable eslint during build for faster deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig