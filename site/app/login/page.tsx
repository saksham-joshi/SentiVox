'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VALUES } from '@/lib/values'
import { useAuth } from '@/lib/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  User,
  Info,
} from 'lucide-react'

type Step = 'email' | 'otp' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const { isLoggedIn, refresh: refreshAuth } = useAuth()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  // Section 4 Requirement: If an authenticated user visits /login, display "You are already logged in." and redirect to /
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center px-4">
        <Card className="w-full max-w-md glass border-border/60 shadow-2xl text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
            <Info size={24} />
          </div>
          <CardTitle className="text-xl">You are already logged in.</CardTitle>
          <CardDescription className="text-foreground-muted">
            Redirecting you to the home page…
          </CardDescription>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-primary text-background hover:bg-primary-hover"
          >
            Go to Home Now
          </Button>
        </Card>
      </div>
    )
  }

  const isValidEmail = (emailStr: string) => {
    return VALUES.ALLOWED_EMAIL_DOMAINS.some((domain) =>
      emailStr.toLowerCase().endsWith(domain)
    )
  }

  const isValidName = (nameStr: string) => {
    const nameRegex = /^[A-Za-z\s]+$/
    return (
      nameRegex.test(nameStr) && nameStr.length >= 2 && nameStr.length <= 19
    )
  }

  const handleSendOtp = async () => {
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!isValidEmail(email)) {
      setError(
        `Only ${VALUES.ALLOWED_EMAIL_DOMAINS.join(' or ')} emails are allowed`
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setStep('otp')
      setAttempts(0)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send OTP. Please try again!'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-character OTP')
      return
    }

    if (attempts >= 3) {
      setError(
        'Maximum incorrect OTP attempts reached. Please request a new OTP.'
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          otp: otp.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        const detailedBackendError = data.error || 'Invalid OTP'
        if (newAttempts >= 3) {
          setError(
            `${detailedBackendError}. Maximum 3 attempts reached. Please restart.`
          )
        } else {
          setError(
            `${detailedBackendError}. ${3 - newAttempts} attempt(s) remaining.`
          )
        }
        setOtp('')
        return
      }

      if (data.exists) {
        // Existing user authenticated - sync client auth state, redirect to /
        await refreshAuth()
        router.push('/')
      } else {
        // New user — prompt for name registration
        setStep('register')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to verify OTP. Please try again!'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    setError('')
    const trimmedName = name.trim()

    if (!isValidName(trimmedName)) {
      setError('Name must contain only letters and spaces, 2-19 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: trimmedName,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to register account')
      }

      await refreshAuth()
      router.push('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to register. Please try again!'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex justify-center px-4 items-center py-12">
      <div className="w-full max-w-md">
        <Card className="glass border-border/60 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">
              {step === 'email' && 'Login / Register'}
              {step === 'otp' && 'Enter Verification Code'}
              {step === 'register' && 'Complete Profile'}
            </CardTitle>
            <CardDescription className="text-foreground-muted text-sm">
              {step === 'email' &&
                'Enter your email to receive a single-use OTP'}
              {step === 'otp' && `Enter the 6-character OTP sent to ${email}`}
              {step === 'register' &&
                'Enter your full name to set up your account'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {error && (
              <div
                className="flex items-start gap-2.5 p-3.5 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger animate-fade-in"
                role="alert"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="wrap-break-word">{error}</span>
              </div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      className="pl-10 bg-surface/50 border-border/60 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Allowed domains: {VALUES.ALLOWED_EMAIL_DOMAINS.join(', ')}
                  </p>
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading || !email.trim()}
                  className="w-full gap-2 bg-primary text-background hover:bg-primary-hover"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary"
                  >
                    Enter 6-Character OTP
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="******"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.toLowerCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                    className="text-center text-2xl tracking-[0.4em] font-sans bg-surface/50 border-border/60 focus:border-primary"
                    disabled={isLoading || attempts >= 3}
                  />
                  <p className="text-xs text-foreground-muted text-center">
                    Check your email inbox or spam folder
                  </p>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length !== 6 || attempts >= 3}
                  className="w-full gap-2 bg-primary text-background hover:bg-primary-hover"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Verify &amp; Continue
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setError('')
                    setAttempts(0)
                  }}
                  className="w-full text-xs text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center gap-1.5 py-1"
                >
                  <ArrowLeft size={14} />
                  Use a different email address
                </button>
              </div>
            )}

            {/* Register Step */}
            {step === 'register' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary"
                  >
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                      size={18}
                    />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                      className="pl-10 bg-surface/50 border-border/60 focus:border-primary"
                      disabled={isLoading}
                      maxLength={19}
                    />
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Letters and spaces only (2 to 19 characters)
                  </p>
                </div>

                <div className="p-3 bg-surface/40 border border-border/40 rounded-xl text-xs space-y-1 text-foreground-secondary">
                  <p>
                    Account Email:{' '}
                    <span className="text-foreground font-medium">{email}</span>
                  </p>
                  <p className="text-foreground-muted">
                    A unique API key will be assigned to your profile upon
                    registration.
                  </p>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading || !name.trim()}
                  className="w-full gap-2 bg-primary text-background hover:bg-primary-hover"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Profile…
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
