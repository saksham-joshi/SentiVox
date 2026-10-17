import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

const PROTECTED = '/account'
const AUTH_ONLY = '/login' // redirect away if already logged in

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const path = req.nextUrl.pathname

  const isProtected = path.startsWith(PROTECTED)
  const isAuthPage = path.startsWith(AUTH_ONLY)

  let isValid = false

  if (token) {
    try {
      await jwtVerify(token, SECRET)
      isValid = true
    } catch {
      // expired or invalid — fall through
    }
  }

  if (isProtected && !isValid) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthPage && isValid) {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Skip static files, Next.js internals
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}
