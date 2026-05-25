import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@yogara/database',
    '@yogara/auth',
    '@yogara/config',
    '@yogara/modules',
    '@yogara/themes',
    '@yogara/ui',
    '@yogara/email',
    '@yogara/queue',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
