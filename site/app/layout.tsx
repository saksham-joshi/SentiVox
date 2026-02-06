import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VALUES } from "@/lib/values";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: VALUES.APP_NAME,
    template: `%s | ${VALUES.APP_NAME}`,
  },
  description: VALUES.APP_DESCRIPTION,
  keywords: [
    "sentiment analysis",
    "text analysis",
    "natural language processing",
    "NLP",
    "polarity detection",
    "opinion mining",
    "multilingual",
    "word cloud",
    "sentiment detection",
    "text sentiment",
    "AI analysis",
  ],
  authors: [
    {
      name: VALUES.APP_AUTHOR[0].name,
      url: VALUES.APP_AUTHOR[0].portfolio
    },
  ],
  creator: VALUES.APP_AUTHOR[0].name,
  publisher: VALUES.APP_AUTHOR[0].name,
  metadataBase: new URL(VALUES.APP_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: VALUES.APP_URL,
    title: VALUES.APP_NAME,
    description: VALUES.APP_DESCRIPTION,
    siteName: VALUES.APP_NAME,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${VALUES.APP_NAME} - ${VALUES.APP_SHORT_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: VALUES.APP_NAME,
    description: VALUES.APP_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <BottomNav />
          <main className="flex-1 pt-4 md:pt-16 pb-20 md:pb-0">
            {/* Premium Global Background */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
              {/* Deep atmospheric base */}
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

              {/* Top center radiance */}
              <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[radial-gradient(circle_at_center,var(--primary-soft)_0%,transparent_70%)] opacity-30 blur-[100px]" style={{ '--primary-soft': 'rgba(68, 137, 200, 0.4)' } as React.CSSProperties} />

              {/* Floating orbs for depth */}
              <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />

              {/* Center glow connecting elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

              {/* Subtle grid pattern overlay (optional for tech feel) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
