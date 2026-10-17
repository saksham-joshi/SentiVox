import type { Metadata } from 'next'
import { DOCS } from '@/lib/docs'
import { VALUES } from '@/lib/values'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Wrench,
  Code,
  Server,
  ArrowRight,
  ExternalLink,
  Languages,
  Smile,
} from 'lucide-react'
import Link from 'next/link'
import { SEO } from '@/lib/seo'
import ApiUrlBlock from '@/components/ApiUrlBlock'
import { memo } from 'react'
import ApiDocsBlock from '@/components/ApiDocsBlock'

export const metadata: Metadata = {
  title: 'Documentation',
  description: `API documentation for ${VALUES.APP_NAME} - Learn how to integrate sentiment analysis into your applications.`,
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

function DocsPage() {
  return (
    <div className="min-h-screen py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <Code className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            API Documentation
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto">
            {DOCS.description}
          </p>
        </div>

        {/* API URL block */}
        <ApiUrlBlock />

        <ApiDocsBlock />

        {/* Supported Languages */}
        <Card className="glass border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Languages size={20} />
              Supported Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {DOCS.SUPPORTED_LANGS.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="glass border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Server size={20} />
              API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(DOCS.ENDPOINTS.endpoints).map(
              ([endpoint, description]) => (
                <div
                  key={endpoint}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-surface/50 border border-border/40 rounded-xl"
                >
                  <code className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    {endpoint}
                  </code>
                  <ArrowRight
                    size={16}
                    className="hidden sm:block text-foreground-muted shrink-0"
                  />
                  <span className="text-xs text-foreground-secondary">
                    {description}
                  </span>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Utility Endpoints */}
        <Card className="glass border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Wrench size={20} />
              Utility Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(DOCS.ENDPOINTS.utility).map(([key, item]) => (
              <div key={key} className="space-y-2">
                <h3 className="text-sm font-semibold capitalize text-foreground">
                  {key}
                </h3>
                <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                  <pre className="text-xs font-mono">
                    <span className="text-success font-bold">
                      {item.method}
                    </span>{' '}
                    <span className="text-primary font-bold">
                      {item.endpoint}
                    </span>
                  </pre>
                </div>
                {'description' in item && (
                  <p className="text-xs text-foreground-muted">
                    {item.description}
                  </p>
                )}
                {'format' in item && (
                  <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                    <pre className="text-xs font-mono text-foreground-secondary">
                      {JSON.stringify(item.format, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Context-Free Analysis */}
        <Card className="glass border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Smile size={20} />
              Context-Free Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-foreground-muted">
              {DOCS.ENDPOINTS['context-free-analysis'].description}
            </p>

            {/* Single Comment */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Single Comment Analysis
              </h3>
              <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                <pre className="text-xs font-mono">
                  <span className="text-success font-bold">POST</span>{' '}
                  <span className="text-primary font-bold">
                    {
                      DOCS.ENDPOINTS['context-free-analysis'][
                        'single-comment-analysis'
                      ].endpoint
                    }
                  </span>
                </pre>
              </div>
              <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                <pre className="text-xs font-mono text-foreground-secondary">
                  {`{
  "api-key": "your-api-key",
  "comment": "text to analyze"
}`}
                </pre>
              </div>
            </div>

            {/* Batch Comments */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Batch Comment Analysis
              </h3>
              <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                <pre className="text-xs font-mono">
                  <span className="text-success font-bold">POST</span>{' '}
                  <span className="text-primary font-bold">
                    {
                      DOCS.ENDPOINTS['context-free-analysis'][
                        'batch-comment-analysis'
                      ].endpoint
                    }
                  </span>
                </pre>
              </div>
              <div className="bg-surface/60 border border-border/40 rounded-xl p-3.5 overflow-x-auto">
                <pre className="text-xs font-mono text-foreground-secondary">
                  {`{
  "api-key": "your-api-key",
  "comment-list": ["comment1", "comment2", "..."]
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context-Based Analysis */}
        <Card className="glass border-warning/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-warning">
              Context-Based Analysis
              <span className="text-xs bg-warning/20 text-warning px-2.5 py-0.5 rounded-full font-semibold">
                Coming Soon
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-foreground-muted">
              {DOCS.ENDPOINTS['context-based-analysis'].description}
            </p>
            <p className="text-xs text-warning italic">
              {DOCS.ENDPOINTS['context-based-analysis'].endpoints}
            </p>
          </CardContent>
        </Card>

        {/* GitHub Link */}
        <div className="text-center pt-4">
          <Link
            href={DOCS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium text-sm"
          >
            View Repository on GitHub
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default memo(DocsPage)

export const dynamic = 'error'
