'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AnalyzerInput from '@/components/AnalyzerInput'
import SentimentResult from '@/components/SentimentResult'
import HeroSection from '@/components/HeroSection'
import { useAuth } from '@/lib/auth-provider'
import { AnalysisResult, analyzeSingleComment } from '@/api/cf-model/api'
import { AlertCircle, Sparkles, User } from 'lucide-react'
import { VALUES } from '@/lib/values'

interface MessageExchange {
  id: string
  originalText: string
  result?: AnalysisResult
  error?: string
}

const COOKIE_KEY_LAST_N_MESSAGES = VALUES.LOCAL_STORAGE_KEY

export default function Home() {
  const router = useRouter()
  const { isLoggedIn, refresh: refreshAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [exchanges, setExchanges] = useState<MessageExchange[]>([])
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // runs only when the page is loaded or reloaded
  useEffect(() => {
    try {
      const local_storage_exchanges = localStorage.getItem(
        COOKIE_KEY_LAST_N_MESSAGES
      )
      if (local_storage_exchanges) {
        setExchanges(JSON.parse(local_storage_exchanges) as MessageExchange[])
      }
    } catch (err) {
      // if local storage is tampered, then clean it completely
      localStorage.removeItem(COOKIE_KEY_LAST_N_MESSAGES)
    }
  }, [])

  // Scroll to bottom when exchanges update or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [exchanges, isLoading])

  const handleAnalyze = async (text: string) => {
    // Authentication requirement: redirect unauthenticated users to /login
    // Re-check with the server before redirecting: covers the initial
    // session fetch still being in flight and a login from another tab.
    if (!isLoggedIn && !(await refreshAuth())) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    setError(null)
    const id = Date.now().toString()

    try {
      const result = await analyzeSingleComment(text)
      setExchanges((prev) => {
        const updated = [...prev, { id, originalText: text, result }]
        // Keep ONLY the last 10 exchanges on client-side
        const last_N_messages = updated.slice(-10)
        localStorage.setItem(
          COOKIE_KEY_LAST_N_MESSAGES,
          JSON.stringify(last_N_messages)
        )
        return last_N_messages
      })
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMsg)
      setExchanges((prev) => {
        const updated = [...prev, { id, originalText: text, error: errorMsg }]
        return updated.slice(-10)
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Header */}
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col max-w-4xl pb-12">
        {/* Chat Feed */}
        <div className="flex-1 space-y-6 mb-8">
          {isLoggedIn &&
            exchanges.map((exchange) => (
              <div key={exchange.id} className="space-y-4 animate-slide-up">
                {/* User Message — Aligned to RIGHT */}
                <div className="flex justify-end items-start gap-3 pl-8">
                  <div className="max-w-xl rounded-2xl rounded-tr-none px-4 py-3 bg-primary/20 border border-primary/30 text-foreground shadow-sm">
                    <p className="text-sm sm:text-base whitespace-pre-wrap wrap-break-word">
                      {exchange.originalText}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
                    <User size={16} />
                  </div>
                </div>

                {/* API Response — Aligned to LEFT */}
                {exchange.result && (
                  <div className="flex justify-start items-start gap-3 pr-8">
                    <div className="w-8 h-8 rounded-full bg-surface-soft border border-border flex items-center justify-center shrink-0 text-primary">
                      <Sparkles size={16} />
                    </div>
                    <div className="max-w-2xl flex-1">
                      <SentimentResult
                        data={exchange.result}
                        originalText={exchange.originalText}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message — Aligned to LEFT */}
                {exchange.error && (
                  <div className="flex justify-start items-start gap-3 pr-8">
                    <div className="w-8 h-8 rounded-full bg-danger/20 border border-danger/40 flex items-center justify-center shrink-0 text-danger">
                      <AlertCircle size={16} />
                    </div>
                    <div className="max-w-xl rounded-2xl rounded-tl-none p-4 bg-danger/10 border border-danger/30 text-danger text-sm">
                      {exchange.error}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Loading Indicator — Aligned to RIGHT */}
          {isLoading && (
            <div className="flex justify-end items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div
                className="rounded-2xl rounded-tl-none px-5 py-3.5 glass border border-primary/30 text-primary flex items-center gap-1.5"
                role="status"
                aria-label="Analyzing text"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-[typing-dot_1.4s_infinite_0ms]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-[typing-dot_1.4s_infinite_200ms]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-[typing-dot_1.4s_infinite_400ms]" />
              </div>
            </div>
          )}

          {/* General API error banner if no exchange created */}
          {error && exchanges.length === 0 && (
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl text-center text-danger text-sm flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="bottom-4 z-20">
          <AnalyzerInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      </div>

      {/* Unobtrusive Privacy & Persistence Note */}
      <div className="mb-0 p-2 text-center text-[.6rem] text-foreground-muted flex items-center justify-center gap-2">
        {/* <ShieldAlert size={12} className="text-primary shrink-0" /> */}
        <span>
          Chat history is stored strictly in client memory (max 10 exchanges)
          and is never saved on our servers.
        </span>
      </div>
    </div>
  )
}

export const dynamic = 'error'
