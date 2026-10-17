'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Key,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  Calendar,
  CheckCircle,
  RefreshCw,
  RotateCw,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { getTokenCount, refreshApiKey } from '@/api/redis-interface/redis'
import { VALUES } from '@/lib/values'
import { useAuth } from '@/lib/auth-provider'

interface AccountClientViewProps {
  user: {
    email: string
    fullName: string
    apiKey: string
    joinDate: string | null
    apiKeyUpdateTime: string | null
  }
}

export default function AccountClientView({ user }: AccountClientViewProps) {
  const router = useRouter()
  const { refresh: refreshAuth } = useAuth()
  const [apiKey, setApiKey] = useState(user.apiKey)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tokenCount, setTokenCount] = useState<number | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)
  const [isRotating, setIsRotating] = useState(false)
  const [rotateError, setRotateError] = useState<string | null>(null)
  const [rotateSuccess, setRotateSuccess] = useState<string | null>(null)

  // Fetch initial token count
  useEffect(() => {
    let isMounted = true
    const fetchTokens = async () => {
      try {
        setTokenLoading(true)
        const count = await getTokenCount(apiKey)
        if (isMounted && count.ok) setTokenCount(count.tokenCount)
        // else if (isMounted)
        //   throw new Error("Something went wrong request or interface's server")
      } catch (err) {
        console.error('Failed to fetch token count:', err)
        if (isMounted) setTokenCount(null)
      } finally {
        if (isMounted) setTokenLoading(false)
      }
    }
    fetchTokens()
    return () => {
      isMounted = false
    }
  }, [apiKey])

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard?.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRotateApiKey = async () => {
    setIsRotating(true)
    setRotateError(null)
    setRotateSuccess(null)

    try {
      const res = await fetch('/api/auth/rotate-api-key', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to rotate API key')
      }

      setRotateSuccess('API Key successfully rotated!')
      // Refresh the page so server re-reads rotated user details
      router.refresh()
      setShowApiKey(false)
    } catch (err) {
      setRotateError(
        err instanceof Error ? err.message : 'Failed to rotate API key'
      )
    } finally {
      setIsRotating(false)
    }
  }

  const handleRefreshTokenCount = async () => {
    try {
      setTokenLoading(true)
      await refreshApiKey(apiKey)
      const count = await getTokenCount(apiKey)
      if (count.ok) setTokenCount(count.tokenCount)
      else
        throw new Error(
          count.msg ?? "Something went wrong with request or interface' server"
        )
    } catch (error) {
      console.error('Failed to refresh token count:', error)
      setTokenCount(null)
    } finally {
      setTokenLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem(VALUES.LOCAL_STORAGE_KEY)
    } catch (e) {
      console.error('Logout error:', e)
    }
    await refreshAuth()
    router.push('/')
  }

  const maskApiKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '•'.repeat(key.length)
    return (
      key.substring(0, 4) +
      '•'.repeat(key.length - 8) +
      key.substring(key.length - 4)
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full max-w-xl space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Your Account</h1>
        <p className="text-sm text-foreground-muted">
          Manage your Senti-Vox API keys and credentials
        </p>
      </div>

      {/* User Info Card */}
      <Card className="glass border-border/60 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <User size={18} />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-0.5">
            <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">
              Full Name
            </span>
            <p className="text-base font-medium text-foreground">
              {user.fullName}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">
              Email Address
            </span>
            <p className="text-base font-medium text-foreground">
              {user.email}
            </p>
          </div>

          {/* Token Count */}
          <div className="space-y-1 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">
                Available Tokens
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-foreground-muted hover:text-primary transition-colors"
                onClick={handleRefreshTokenCount}
                disabled={tokenLoading}
                title="Refresh token count"
                aria-label="Refresh token count"
              >
                <RefreshCw
                  size={14}
                  className={tokenLoading ? 'animate-spin' : ''}
                />
              </Button>
            </div>
            <p className="text-xl font-bold font-mono text-primary">
              {tokenLoading ? (
                <span className="animate-pulse text-sm text-foreground-muted">
                  Loading…
                </span>
              ) : tokenCount !== null ? (
                tokenCount.toLocaleString()
              ) : (
                <span className="text-xs text-danger">Failed to load!</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground-muted pt-2 border-t border-border/40">
            <Calendar size={14} />
            <span>Member since {formatDate(user.joinDate)}</span>
          </div>
        </CardContent>
      </Card>

      {/* API Key Card */}
      <Card className="glass border-border/60 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <Key size={18} />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-foreground-muted leading-relaxed">
            Keep your API key secret! Do not share it in public repositories or
            client-side code.
          </p>

          {/* Success / Error Messages */}
          {rotateSuccess && (
            <div className="p-3 bg-success/10 border border-success/30 rounded-xl text-xs text-success flex items-center gap-2 animate-fade-in">
              <CheckCircle size={14} />
              {rotateSuccess}
            </div>
          )}

          {rotateError && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger flex items-center gap-2 animate-fade-in">
              <AlertCircle size={14} />
              {rotateError}
            </div>
          )}

          {/* API Key Display Box */}
          <div className="p-3 bg-surface/60 border border-border/60 rounded-xl font-mono text-xs text-foreground break-all tracking-wider">
            {showApiKey ? apiKey : maskApiKey(apiKey)}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Eye Reveal Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKey(!showApiKey)}
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              className="gap-2 border-border/60 hover:bg-surface-soft text-foreground text-xs"
            >
              {showApiKey ? (
                <>
                  <EyeOff size={14} aria-hidden="true" />
                  Hide Key
                </>
              ) : (
                <>
                  <Eye size={14} aria-hidden="true" />
                  Show Key
                </>
              )}
            </Button>

            {/* Copy Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyApiKey}
              aria-label="Copy API key"
              className="gap-2 border-border/60 hover:bg-surface-soft text-foreground text-xs"
            >
              {copied ? (
                <>
                  <CheckCircle
                    size={14}
                    className="text-success"
                    aria-hidden="true"
                  />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  Copy Key
                </>
              )}
            </Button>

            {/* Rotate API Key Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotateApiKey}
              disabled={isRotating}
              aria-label="Rotate API Key"
              className="gap-2 border-primary/40 text-primary hover:bg-primary/10 text-xs"
            >
              {isRotating ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <RotateCw size={14} aria-hidden="true" />
              )}
              Rotate API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-full gap-2 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/40"
        size="lg"
      >
        <LogOut size={16} />
        Sign Out
      </Button>
    </div>
  )
}
