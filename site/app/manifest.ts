import { MetadataRoute } from 'next'
import { VALUES } from '@/lib/values'
import { COLORS } from '@/lib/colors'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: VALUES.APP_NAME,
    short_name: VALUES.APP_NAME,
    description: VALUES.APP_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: COLORS.dark.background,
    theme_color: COLORS.dark.primary,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
