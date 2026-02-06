"use client";

import { useState } from "react";
import { Globe, Copy, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DOCS } from "@/lib/docs";

export default function ApiUrlBlock() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard?.writeText(DOCS.apiUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <Card className="mb-8 overflow-hidden border-primary/20 group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Globe size={20} className="text-primary" />
                    API URL
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card/50 rounded-xl border border-border group-hover:border-primary/30 transition-colors bg-primary/2">
                    <code className="text-sm font-mono break-all text-muted-foreground flex-1 sm:max-w-[70%]">
                        {DOCS.apiUrl}
                    </code>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 sm:flex-none gap-2"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>
                                    <Check size={16} className="text-success" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copy</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1 sm:flex-none gap-2 shadow-sm transition-all hover:scale-105"
                        >
                            <a href={DOCS.apiUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} />
                            </a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
