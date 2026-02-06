"use client";

import { FileDown, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";

interface SentimentData {
    sentiment: "Positive" | "Negative" | "Neutral";
    polarity_score: number;
    positive_score: number;
    negative_score: number;
    keywords: { [key: string]: number };
    positive_words: string[];
    negative_words: string[];
    unidentified_words: string[];
    word_cloud?: string;
}

interface SentimentResultProps {
    data: SentimentData;
    originalText: string;
}

export default function SentimentResult({ data, originalText }: SentimentResultProps) {

    const getSentimentColor = () => {
        switch (data.sentiment) {
            case "Positive":
                return "text-success bg-success-soft";
            case "Negative":
                return "text-danger bg-danger-soft";
            default:
                return "text-neutral bg-neutral-soft";
        }
    };

    const getSentimentEmoji = () => {
        switch (data.sentiment) {
            case "Positive":
                return "🟢";
            case "Negative":
                return "🔴";
            default:
                return "🔵";
        }
    };

    const getPolarityWidth = () => {
        // Convert -1 to 1 range to 0 to 100 percentage
        return ((data.polarity_score + 1) / 2) * 100;
    };

    const handleDownloadMarkdown = () => {
        const markdown = `# Sentiment Analysis Result

## Summary
- **Sentiment:** ${data.sentiment} ${getSentimentEmoji()}
- **Polarity Score:** ${data.polarity_score}
- **Positive Words Count:** ${data.positive_score}
- **Negative Words Count:** ${data.negative_score}

## Original Text
> ${originalText}

## Keywords
${Object.keys(data.keywords).map((k) => `- ${k}`).join("\n")}

## Positive Words
${data.positive_words.length > 0 ? data.positive_words.map((w) => `- ${w}`).join("\n") : "None found"}

## Negative Words
${data.negative_words.length > 0 ? data.negative_words.map((w) => `- ${w}`).join("\n") : "None found"}

## Unidentified Words
${data.unidentified_words.length > 0 ? data.unidentified_words.map((w) => `- ${w}`).join("\n") : "None found"}

## Word Cloud
${data.word_cloud}
`;

        downloadFile(markdown, "sentiment-analysis.md", "text/markdown");
    };

    const handleDownloadJSON = () => {
        const json = JSON.stringify({ originalText, ...data }, null, 2);
        downloadFile(json, "sentiment-analysis.json", "application/json");
    };

    const handleDownloadPDF = () => {
        // Simple PDF generation using browser print
        const content = `
      <html>
        <head>
          <title>Sentiment Analysis - ${data.sentiment}</title>
          <style>
            body { font-family: system-ui; padding: 40px; }
            h1 { color: ${COLORS.primary}; }
            .sentiment { font-size: 24px; padding: 10px 20px; border-radius: 8px; display: inline-block; }
            .positive { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
            .negative { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
            .neutral { background: rgba(113, 113, 122, 0.15); color: #0085e4; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .words { display: flex; flex-wrap: wrap; gap: 8px; }
            .word { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; }
          </style>
        </head>
        <body>
          <h1>Sentiment Analysis Result</h1>
          <p class="sentiment ${data.sentiment.toLowerCase()}">${getSentimentEmoji()} ${data.sentiment}</p>
          <table>
            <tr><td><strong>Polarity Score</strong></td><td>${data.polarity_score}</td></tr>
            <tr><td><strong>Positive Words</strong></td><td>${data.positive_score}</td></tr>
            <tr><td><strong>Negative Words</strong></td><td>${data.negative_score}</td></tr>
          </table>
          <h2>Keywords</h2>
          <div class="words">${Object.keys(data.keywords).map((k) => `<span class="word">${k}</span>`).join("")}</div>
          <h2>Positive Words</h2>
          <div class="words">${data.positive_words.map((k) => `<span class="word">${k}</span>`).join("")}</div>
          <h2>Negative Words</h2>
          <div class="words">${data.negative_words.map((k) => `<span class="word">${k}</span>`).join("")}</div>
          <h2>Unidentified Words</h2>
          <div class="words">${data.unidentified_words.map((k) => `<span class="word">${k}</span>`).join("")}</div>
          <h2>Original Text</h2>
          <blockquote>${originalText}</blockquote>
          <h2>Word Cloud</h2>
          <div class="words">${data.word_cloud}</div>
        </body>
      </html>
    `;

        const win = window.open("", "_blank");
        if (win) {
            win.document.write(content);
            win.document.close();
            win.print();
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="animate-slide-up hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{getSentimentEmoji()}</span>
                        <div>
                            <CardTitle className="text-lg">Result</CardTitle>
                            <span className={cn("inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium", getSentimentColor())}>
                                {data.sentiment}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={handleDownloadMarkdown} title="Download Markdown">
                            <FileText size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleDownloadPDF} title="Download PDF">
                            <FileDown size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleDownloadJSON} title="Download JSON">
                            <FileJson size={16} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Polarity Score Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Polarity Score</span>
                        <span className="font-mono font-medium">{data.polarity_score.toFixed(2)}</span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-danger to-success rounded-full transition-all duration-500"
                            style={{ width: "100%" }}
                        />
                        <div
                            className="absolute top-0 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-primary transition-all duration-500"
                            style={{ left: `calc(${getPolarityWidth()}% - 6px)` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Negative (-1)</span>
                        <span>Neutral (0)</span>
                        <span>Positive (+1)</span>
                    </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-success-soft rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-success">{data.positive_score}</div>
                        <div className="text-sm text-muted-foreground">Positive Score</div>
                    </div>
                    <div className="bg-danger-soft rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-danger">{data.negative_score}</div>
                        <div className="text-sm text-muted-foreground">Negative Score</div>
                    </div>
                </div>

                {/* Word Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.positive_words.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 text-success">Positive Words</h4>
                            <div className="flex flex-wrap gap-1">
                                {data.positive_words.map((word, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-success/10 text-success text-sm rounded">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.negative_words.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 text-danger">Negative Words</h4>
                            <div className="flex flex-wrap gap-1">
                                {data.negative_words.map((word, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-danger/10 text-danger text-sm rounded">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.unidentified_words.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 text-warning">Unidentified Words</h4>
                            <div className="flex flex-wrap gap-1">
                                {data.unidentified_words.map((word, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-warning/10 text-warning text-sm rounded">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Keywords */}
                {Object.keys(data.keywords).length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(data.keywords).map((keyword, i) => (
                                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Word Cloud */}
                {data.word_cloud && (
                    <div>
                        <div
                            className="bg-muted rounded-lg p-4 flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
                            dangerouslySetInnerHTML={{ __html: data.word_cloud }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
