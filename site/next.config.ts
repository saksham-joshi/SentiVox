import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.56.1', '127.0.0.1', '10.32.106.164'],

  env: {
    // compile time maintenance mode
    NEXT_PUBLIC_MAINTENANCE_MODE: 'false',
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  turbopack: {},

  webpack: (config) => {
    config.module.rules.push({
      test: /\.lua$/,
      type: 'asset/source',
    })
    return config
  },

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
