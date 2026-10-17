'use client'

import { FileDown, FileJson, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SentimentData {
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  polarity_score: number
  positive_score: number
  negative_score: number
  keywords: { [key: string]: number }
  positive_words: string[]
  negative_words: string[]
  unidentified_words: string[]
  word_cloud?: string
}

interface SentimentResultProps {
  data: SentimentData
  originalText: string
}

export default function SentimentResult({
  data,
  originalText,
}: SentimentResultProps) {
  const getSentimentBadge = () => {
    switch (data.sentiment) {
      case 'Positive':
        return 'text-success bg-success/15 border-success/30'
      case 'Negative':
        return 'text-danger bg-danger/15 border-danger/30'
      default:
        return 'text-info bg-info/15 border-info/30'
    }
  }

  const getSentimentEmoji = () => {
    switch (data.sentiment) {
      case 'Positive':
        return '🟢'
      case 'Negative':
        return '🔴'
      default:
        return '🔵'
    }
  }

  const getPolarityWidth = () => {
    return ((data.polarity_score + 1) / 2) * 100
  }

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
${Object.keys(data.keywords)
  .map((k) => `- ${k}`)
  .join('\n')}

## Positive Words
${data.positive_words.length > 0 ? data.positive_words.map((w) => `- ${w}`).join('\n') : 'None found'}

## Negative Words
${data.negative_words.length > 0 ? data.negative_words.map((w) => `- ${w}`).join('\n') : 'None found'}

## Unidentified Words
${data.unidentified_words.length > 0 ? data.unidentified_words.map((w) => `- ${w}`).join('\n') : 'None found'}
`
    downloadFile(markdown, 'sentiment-analysis.md', 'text/markdown')
  }

  const handleDownloadJSON = () => {
    const json = JSON.stringify({ originalText, ...data }, null, 2)
    downloadFile(json, 'sentiment-analysis.json', 'application/json')
  }

  const handleDownloadPDF = () => {
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sentiment Analysis - ${data.sentiment}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            h1 { color: #02bbad; }
            .sentiment { font-size: 20px; font-weight: bold; padding: 8px 16px; border-radius: 8px; display: inline-block; }
            .positive { background: rgba(2, 187, 173, 0.15); color: #02bbad; }
            .negative { background: rgba(228, 93, 120, 0.15); color: #e45d78; }
            .neutral { background: rgba(76, 159, 209, 0.15); color: #4c9fd1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
            .words { display: flex; flex-wrap: wrap; gap: 6px; }
            .word { background: #f0f4f8; padding: 4px 10px; border-radius: 12px; font-size: 14px; }
            blockquote { background: #f8fafc; padding: 12px 16px; border-left: 4px solid #02bbad; margin: 16px 0; }
          </style>
        </head>
        <body>
          <h1>Sentiment Analysis Result</h1>
          <div class="sentiment ${data.sentiment.toLowerCase()}">${getSentimentEmoji()} ${data.sentiment}</div>
          <table>
            <tr><td><strong>Polarity Score</strong></td><td>${data.polarity_score.toFixed(2)}</td></tr>
            <tr><td><strong>Positive Score</strong></td><td>${data.positive_score}</td></tr>
            <tr><td><strong>Negative Score</strong></td><td>${data.negative_score}</td></tr>
          </table>
          <h2>Original Text</h2>
          <blockquote >${originalText}</blockquote>
          ${
            Object.keys(data.keywords).length > 0
              ? `<h2>Keywords</h2><div class="words">${Object.keys(
                  data.keywords
                )
                  .map((k) => `<span class="word">${k}</span>`)
                  .join('')}</div>`
              : ''
          }
          ${data.positive_words.length > 0 ? `<h2>Positive Words</h2><div class="words">${data.positive_words.map((k) => `<span class="word">${k}</span>`).join('')}</div>` : ''}
          ${data.negative_words.length > 0 ? `<h2>Negative Words</h2><div class="words">${data.negative_words.map((k) => `<span class="word">${k}</span>`).join('')}</div>` : ''}
        </body>
      </html>
    `

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(content)
      win.document.close()
      win.print()
    }
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="glass border-border/60 shadow-xl animate-slide-up">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSentimentEmoji()}</span>
            <div>
              <CardTitle className="text-base font-semibold">
                Analysis Result
              </CardTitle>
              <span
                className={cn(
                  'inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                  getSentimentBadge()
                )}
              >
                {data.sentiment}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadMarkdown}
              title="Download Markdown"
              aria-label="Download result as Markdown"
              className="h-8 w-8 text-foreground-muted hover:text-foreground hover:bg-surface-soft"
            >
              <FileText size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadPDF}
              title="Download PDF"
              aria-label="Download result as PDF"
              className="h-8 w-8 text-foreground-muted hover:text-foreground hover:bg-surface-soft"
            >
              <FileDown size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadJSON}
              title="Download JSON"
              aria-label="Download result as JSON"
              className="h-8 w-8 text-foreground-muted hover:text-foreground hover:bg-surface-soft"
            >
              <FileJson size={15} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4 text-sm">
        {/* Polarity Score Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-foreground-muted">Polarity Index</span>
            <span className="font-mono text-primary">
              {data.polarity_score.toFixed(2)}
            </span>
          </div>
          <div className="relative h-2.5 bg-surface-soft rounded-full overflow-hidden border border-border/40">
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-danger via-warning to-success rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            />
            <div
              className="absolute top-0 w-2.5 h-2.5 bg-foreground rounded-full shadow border border-background transition-all duration-500"
              style={{ left: `calc(${getPolarityWidth()}% - 5px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-foreground-muted mt-1 font-mono">
            <span>-1.0 (Neg)</span>
            <span>0.0 (Neu)</span>
            <span>+1.0 (Pos)</span>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-success font-mono">
              {data.positive_score}
            </div>
            <div className="text-xs text-foreground-muted">Positive Words</div>
          </div>
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-danger font-mono">
              {data.negative_score}
            </div>
            <div className="text-xs text-foreground-muted">Negative Words</div>
          </div>
        </div>

        {/* Word Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.positive_words.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-1.5 text-success uppercase tracking-wider">
                Positive Tokens
              </h4>
              <div className="flex flex-wrap gap-1">
                {data.positive_words.map((word, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-success/10 border border-success/20 text-success text-xs rounded-md"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.negative_words.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-1.5 text-danger uppercase tracking-wider">
                Negative Tokens
              </h4>
              <div className="flex flex-wrap gap-1">
                {data.negative_words.map((word, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-danger/10 border border-danger/20 text-danger text-xs rounded-md"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.unidentified_words.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-xs font-semibold mb-1.5 text-warning uppercase tracking-wider">
                Unidentified Tokens
              </h4>
              <div className="flex flex-wrap gap-1">
                {data.unidentified_words.map((word, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-warning/10 border border-warning/20 text-warning text-xs rounded-md"
                  >
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
            <h4 className="text-xs font-semibold mb-1.5 text-foreground-secondary uppercase tracking-wider">
              Extracted Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(data.keywords).map((keyword, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Word Cloud */}
        {data.word_cloud && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-foreground-secondary uppercase tracking-wider">
              Word Cloud
            </h4>
            <div className="flex justify-center">
              <div
                className="w-full max-w-sm md:max-w-md bg-surface/50 border border-border/40 rounded-xl p-3 flex items-center justify-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-48 md:[&_svg]:max-h-64"
                dangerouslySetInnerHTML={{ __html: data.word_cloud }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
