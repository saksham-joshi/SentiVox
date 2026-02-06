import type { Metadata } from "next";
import { DOCS } from "@/lib/docs";
import { VALUES } from "@/lib/values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Code, Server, ArrowRight, ExternalLink, Languages, Smile } from "lucide-react";
import Link from "next/link";
import { SEO } from "@/lib/seo";
import ApiUrlBlock from "@/components/ApiUrlBlock";

export const metadata: Metadata = {
    title: "Documentation",
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
    twitter: SEO.twitter
};

export default function DocsPage() {
    return (
        <div className="min-h-screen py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                        <Code className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">API Documentation</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {DOCS.description}
                    </p>
                </div>

                {/* API URL block */}
                <ApiUrlBlock />

                {/* Supported Languages */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Languages size={20} className="text-primary" />
                            Supported Languages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {DOCS.SUPPORTED_LANGS.map((lang) => (
                                <span
                                    key={lang}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* API Endpoints */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server size={20} className="text-primary" />
                            API Endpoints
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(DOCS.ENDPOINTS.endpoints).map(([endpoint, description]) => (
                            <div
                                key={endpoint}
                                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted rounded-lg"
                            >
                                <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                    {endpoint}
                                </code>
                                <ArrowRight size={16} className="hidden sm:block text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{description}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Utility Endpoints */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench size={20} className="text-primary" />
                            Utility Endpoints
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {Object.entries(DOCS.ENDPOINTS.utility).map(([key, item]) => (
                            <div key={key} className="space-y-3">
                                <h3 className="font-semibold capitalize">{key}</h3>
                                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-sm font-mono">
                                        <span className="text-success">
                                            {item.method}
                                        </span>{" "}
                                        <span className="text-primary font-bold">
                                            {item.endpoint}
                                        </span>
                                    </pre>
                                </div>
                                {"description" in item && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                                {"format" in item && (
                                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                        <pre className="text-sm font-mono text-foreground">
                                            {JSON.stringify(item.format, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Context-Free Analysis */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smile size={20} className="text-primary" />
                            Context-Free Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-muted-foreground">
                            {DOCS.ENDPOINTS["context-free-analysis"].description}
                        </p>

                        {/* Single Comment */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Single Comment Analysis</h3>
                            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono">
                                    <span className="text-success">POST</span>{" "}
                                    <span className="text-primary font-bold">
                                        {DOCS.ENDPOINTS["context-free-analysis"]["single-comment-analysis"].endpoint}
                                    </span>
                                </pre>
                            </div>
                            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-foreground">
                                    {`{
  "api-key": "your-api-key",
  "comment": "text to analyze"
}`}
                                </pre>
                            </div>
                        </div>

                        {/* Batch Comments */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Batch Comment Analysis</h3>
                            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono">
                                    <span className="text-success">POST</span>{" "}
                                    <span className="text-primary font-bold">
                                        {DOCS.ENDPOINTS["context-free-analysis"]["batch-comment-analysis"].endpoint}
                                    </span>
                                </pre>
                            </div>
                            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-foreground">
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
                <Card className="mb-8 border-warning/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Context-Based Analysis
                            <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">Coming Soon</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {DOCS.ENDPOINTS["context-based-analysis"].description}
                        </p>
                        <p className="text-sm text-muted-foreground italic text-warning">
                            {DOCS.ENDPOINTS["context-based-analysis"].endpoints}
                        </p>
                    </CardContent>
                </Card>

                {/* GitHub Link */}
                <div className="text-center">
                    <Link
                        href={DOCS.GITHUB_REPO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
                    >
                        View on GitHub
                        <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
