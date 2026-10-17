import { NextRequest, NextResponse } from 'next/server'
import { VALUES } from '@/lib/values'
import { registerNewUser } from '@/db/pg'
import { isValidEmail, isValidName } from '@/lib/validator'
import { createSession } from '@/lib/session'
import { grantFreeTokens } from '@/api/redis-interface/redis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        {
          error: `Only ${VALUES.ALLOWED_EMAIL_DOMAINS.join(
            ' or '
          )} emails are allowed`,
        },
        { status: 400 }
      )
    }

    // Validate name
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()

    if (!isValidName(trimmedName)) {
      return NextResponse.json({
        error: 'Name must contain only alphabets and spaces, 2-19 characters',
        status: 400,
      })
    }

    // register the new user
    const user = await registerNewUser(normalizedEmail, trimmedName)

    if (user.success) {
      await grantFreeTokens(user.apiKey)
      await createSession({
        userId: user.email,
        email: user.email,
        name: user.fullName,
      })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('Register error:', error)
  }
  return NextResponse.json(
    { error: 'Failed to create account. Please try again.' },
    { status: 500 }
  )
}
