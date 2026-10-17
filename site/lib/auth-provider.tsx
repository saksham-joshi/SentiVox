'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SessionPayload } from '@/lib/session'

interface AuthContextValue {
  session: SessionPayload | null
  isLoggedIn: boolean
  /** True until the first /api/auth/session response arrives */
  isLoading: boolean
  /** Re-reads the session cookie from the server. Call after login/logout. */
  refresh: () => Promise<SessionPayload | null>
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoggedIn: false,
  isLoading: true,
  refresh: async () => null,
})

async function fetchSession(): Promise<SessionPayload | null> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { session: SessionPayload | null }
    return data.session ?? null
  } catch {
    return null
  }
}

/**
 * The layout (and so every page) stays static — the session is resolved on
 * the client from /api/auth/session instead of being baked in at build time.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const next = await fetchSession()
    setSession(next)
    setIsLoading(false)
    return next
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchSession().then((next) => {
      if (cancelled) return
      setSession(next)
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ session, isLoggedIn: session !== null, isLoading, refresh }),
    [session, isLoading, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
