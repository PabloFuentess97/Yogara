import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@yogara/database',
    '@yogara/auth',
    '@yogara/config',
    '@yogara/modules',
    '@yogara/ui',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
