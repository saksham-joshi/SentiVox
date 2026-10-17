import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { VALUES } from '@/lib/values'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SEO } from '@/lib/seo'
import { TechIcons } from '@/lib/tech'
import { SVG } from '@/lib/svg'
import { DOCS } from '@/lib/docs'
import { InfoIcon, ExternalLink } from 'lucide-react'
import { memo } from 'react'
import Logo from '@/assets/logo.png'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${VALUES.APP_NAME} and its creators.`,
  keywords: SEO.keywords,
  robots: SEO.robots,
  openGraph: SEO.openGraph,
  authors: SEO.author,
  creator: SEO.creator,
  publisher: SEO.publisher,
  manifest: SEO.manifest,
  appleWebApp: SEO.appleWebApp,
  formatDetection: SEO.formatDetection,
  abstract: SEO.abstract,
  assets: SEO.assets,
  category: SEO.category,
  twitter: SEO.twitter,
}

// const socialLinks = [
//   {
//     name: VALUES.APP_AUTHOR[0].name,
//     email: VALUES.APP_AUTHOR[0].email,
//     img: VALUES.APP_AUTHOR[0].img,
//     urls: [
//       {
//         icon: SVG.github,
//         label: 'GitHub',
//         href: VALUES.APP_AUTHOR[0].github,
//       },
//       {
//         icon: SVG.linkedin,
//         label: 'LinkedIn',
//         href: VALUES.APP_AUTHOR[0].linkedin,
//       },
//       {
//         icon: SVG.globe,
//         label: 'Portfolio',
//         href: VALUES.APP_AUTHOR[0].portfolio,
//       },
//       {
//         icon: SVG.mail,
//         label: 'Email',
//         href: `mailto:${VALUES.APP_AUTHOR[0].email}`,
//       },
//     ],
//   },
//   {
//     name: VALUES.APP_AUTHOR[1].name,
//     email: VALUES.APP_AUTHOR[1].email,
//     img: VALUES.APP_AUTHOR[1].img,
//     urls: [
//       {
//         icon: SVG.github,
//         label: 'GitHub',
//         href: VALUES.APP_AUTHOR[1].github,
//       },
//       {
//         icon: SVG.linkedin,
//         label: 'LinkedIn',
//         href: VALUES.APP_AUTHOR[1].linkedin,
//       },
//       {
//         icon: SVG.mail,
//         label: 'Email',
//         href: `mailto:${VALUES.APP_AUTHOR[1].email}`,
//       },
//     ],
//   },
// ]

function AboutPage() {
  return (
    <div className="min-h-screen py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
        {/* Project Section */}
        <section className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden glass border border-primary/30 p-2 shadow-xl shadow-primary/10">
            <Image
              src={Logo}
              alt={VALUES.APP_NAME}
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            About <span className="gradient-text">{VALUES.APP_NAME}</span>
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            {VALUES.APP_DESCRIPTION}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={VALUES.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="gap-2 border-border/60 hover:border-primary/40 glass"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {SVG.github(16)}
                </div>
                View Repository
                <ExternalLink size={14} className="text-foreground-muted" />
              </Button>
            </Link>
            <Link href={VALUES.PRIVACY_POLICY.route}>
              <Button className="gap-2 bg-primary text-background hover:bg-primary-hover">
                <InfoIcon size={16} />
                Privacy Policy
              </Button>
            </Link>
          </div>
        </section>

        {/* Version Info */}
        <Card className="glass border-border/60 shadow-xl">
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                  v{VALUES.APP_VERSION}
                </div>
                <div className="text-xs text-foreground-muted uppercase tracking-wider font-semibold mt-1">
                  Current Version
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                  {DOCS.SUPPORTED_LANGS.length}+
                </div>
                <div className="text-xs text-foreground-muted uppercase tracking-wider font-semibold mt-1">
                  Supported Languages
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                  Free
                </div>
                <div className="text-xs text-foreground-muted uppercase tracking-wider font-semibold mt-1">
                  For Everyone
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center tracking-tight">
            Built With
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TechIcons.map((tech) => (
              <Card
                key={tech.name}
                className="glass border-border/60 hover:border-primary/50 transition-all duration-200 group"
              >
                <CardContent className="py-5 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-200 [&>svg]:w-full [&>svg]:h-full">
                    {tech.svg}
                  </div>
                  <span className="text-xs font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Author Section */}
        {/*<section className="space-y-6">
          <h2 className="text-2xl font-bold text-center tracking-tight">
            Created By
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialLinks.map((value, index) => (
              <Card
                className="glass border-border/60 shadow-xl overflow-hidden"
                key={index}
              >
                <CardContent className="py-6 text-center space-y-3">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-primary/30 p-1">
                    <Image
                      src={value.img}
                      alt={value.name}
                      fill
                      sizes="80px"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {value.name}
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      {value.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {value.urls.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 border-border/60 hover:border-primary/40 text-xs py-1 h-8"
                        >
                          <div className="w-3.5 h-3.5 flex items-center justify-center">
                            {link.icon(14)}
                          </div>
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>*/}
      </div>
    </div>
  )
}

export default memo(AboutPage)

export const dynamic = 'error'
