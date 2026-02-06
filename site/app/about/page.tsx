import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VALUES } from "@/lib/values";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { TechIcons } from "@/lib/tech";
import { SVG } from "@/lib/svg";
import { DOCS } from "@/lib/docs";

export const metadata: Metadata = {
  title: "About",
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
};

const socialLinks = [
  {
    name: VALUES.APP_AUTHOR[0].name,
    email: VALUES.APP_AUTHOR[0].email,
    img : VALUES.APP_AUTHOR[0].img,
    urls: [
      {
        icon: SVG.github,
        label: "GitHub",
        href: VALUES.APP_AUTHOR[0].github,
      },
      {
        icon: SVG.linkedin,
        label: "LinkedIn",
        href: VALUES.APP_AUTHOR[0].linkedin,
      },
      {
        icon: SVG.globe,
        label: "Portfolio",
        href: VALUES.APP_AUTHOR[0].portfolio,
      },
      {
        icon: SVG.mail,
        label: "Email",
        href: `mailto:${VALUES.APP_AUTHOR[0].email}`,
      },
    ],
  },
  {
    name: VALUES.APP_AUTHOR[1].name,
    email: VALUES.APP_AUTHOR[1].email,
    img : VALUES.APP_AUTHOR[1].img,
    urls: [
      {
        icon: SVG.github,
        label: "GitHub",
        href: VALUES.APP_AUTHOR[1].github,
      },
      {
        icon: SVG.linkedin,
        label: "LinkedIn",
        href: VALUES.APP_AUTHOR[1].linkedin,
      },
      {
        icon: SVG.mail,
        label: "Email",
        href: `mailto:${VALUES.APP_AUTHOR[1].email}`,
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Project Section */}
        <section className="text-center mb-16">
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg shadow-primary/20">
            <Image
              src="/logo.png"
              alt={VALUES.APP_NAME}
              fill
              sizes="80px"
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="gradient-text">{VALUES.APP_NAME}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {VALUES.APP_DESCRIPTION}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={VALUES.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                {/* <Github size={18} /> */}
                <div className="w-2 h-2 items-center px-2 justify-center flex">
                  {SVG.github}
                </div>
                View Repository
                <div className="w-2 h-2 items-center px-2 justify-center flex">
                  {SVG.externalLink}
                </div>
                {/* <ExternalLink size={14} /> */}
              </Button>
            </Link>
            <Link href="/docs">
              <Button className="gap-2">
                {/* <Code size={18} /> */}
                <div className="w-2 h-2 items-center px-2 justify-center flex">
                  {SVG.code}
                </div>
                Read Docs
              </Button>
            </Link>
          </div>
        </section>

        {/* Version Info */}
        <Card className="mb-12">
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  v{VALUES.APP_VERSION}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Version
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {" "}
                  {DOCS.SUPPORTED_LANGS.length}+
                </div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">
                  For Everyone
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Built With</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TechIcons.map((tech) => (
              <Card
                key={tech.name}
                className="group hover:border-primary/50 transition-all duration-200"
              >
                <CardContent className="py-5 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-200 [&>svg]:w-full [&>svg]:h-full">
                    {tech.svg}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Author Section */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Created By</h2>

          {socialLinks.map((value, index) => {
            return (
              <Card className="overflow-hidden mb-5" key={index}>
                <CardContent className="py-8 text-center">
                  <Image
                    src={value.img}
                    alt={value.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary"
                  />
                  <h3 className="text-xl font-semibold mb-1">{value.name}</h3>
                  <p className="text-muted-foreground mb-6">{value.email}</p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {value.urls.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="gap-2 ">
                          <div
                            style={{ fill: "#ffffff" }}
                            className="w-5 h-5 items-center justify-center flex [&>svg]:w-2.7 [&>svg]:h-2.7"
                          >
                            {link.icon}
                          </div>
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
