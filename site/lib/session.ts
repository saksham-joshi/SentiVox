import { blacklistJWT, isBlacklistedJWT } from '@/api/otp/otp'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE = 'session'
const NO_OF_DAYS_TO_STAY_LOGGED_IN = 56

export interface SessionPayload {
  userId: string
  email: string
  name: string
  iat?: string
  exp?: string
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${NO_OF_DAYS_TO_STAY_LOGGED_IN}d`)
    .sign(SECRET)

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * NO_OF_DAYS_TO_STAY_LOGGED_IN,
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null

  if (await isBlacklistedJWT(token)) {
    jar.delete(COOKIE)
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null // expired or tampered
  }
}

export async function deleteSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value

  if (token) {
    const { payload } = await jwtVerify(token, SECRET)

    const remaining_ttl_in_seconds = Math.floor(
      (payload.exp as number) - Date.now() / 1000
    )

    if (remaining_ttl_in_seconds > 0) {
      await blacklistJWT(token, remaining_ttl_in_seconds)
    }
  }
  jar.delete(COOKIE)
}
