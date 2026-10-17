import type { Metadata } from 'next'
import Image from 'next/image'
import { VALUES } from '@/lib/values'
import BgDark from '@/assets/bg-image-dark.png'
import BgLight from '@/assets/bg-image-light.png'
import { AuthProvider } from '@/lib/auth-provider'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import MaintenancePage from '@/app/maintenance/page'
import './globals.css'

const IS_MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

export const metadata: Metadata = {
  title: {
    default: VALUES.APP_NAME,
    template: `%s | ${VALUES.APP_NAME}`,
  },
  description: VALUES.APP_DESCRIPTION,
  keywords: [
    'sentiment analysis',
    'text analysis',
    'natural language processing',
    'NLP',
    'polarity detection',
    'opinion mining',
    'multilingual',
    'word cloud',
    'sentiment detection',
    'text sentiment',
    'AI analysis',
  ],
  authors: [
    {
      name: VALUES.APP_AUTHOR[0].name,
      url: VALUES.APP_AUTHOR[0].portfolio,
    },
  ],
  creator: VALUES.APP_AUTHOR[0].name,
  publisher: VALUES.APP_AUTHOR[0].name,
  metadataBase: new URL(VALUES.APP_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: VALUES.APP_URL,
    title: VALUES.APP_NAME,
    description: VALUES.APP_DESCRIPTION,
    siteName: VALUES.APP_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${VALUES.APP_NAME} - ${VALUES.APP_SHORT_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: VALUES.APP_NAME,
    description: VALUES.APP_DESCRIPTION,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (IS_MAINTENANCE) {
    return (
      <html lang="en" className="dark">
        <body>
          <MaintenancePage />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {/* Fixed background */}
        <div
          className="fixed inset-0 -z-50 pointer-events-none"
          aria-hidden="true"
        >
          {/* Light Mode Image (Default / Hidden when dark mode is active) */}
          <Image
            src={BgLight}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60 dark:hidden"
          />

          {/* Dark Mode Image (Hidden by default / Visible when dark mode is active) */}
          <Image
            src={BgDark}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60 hidden dark:block"
          />

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <Navbar />
        <BottomNav />
        <AuthProvider>
          <main className="flex-1 pt-4 md:pt-16 pb-20 md:pb-0">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
