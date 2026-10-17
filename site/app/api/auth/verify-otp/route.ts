import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/api/otp/otp'
import { isValidEmail, isValidOTP } from '@/lib/validator'
import { checkIfEmailExists, getUserDetails } from '@/db/pg'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!otp || typeof otp !== 'string') {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 })
    }

    const normalized_email = email.toLowerCase().trim()

    if (!isValidEmail(normalized_email)) {
      return NextResponse.json({ error: 'Invalid Email' }, { status: 400 })
    }

    const normalized_otp = otp.toLowerCase().trim()

    if (!isValidOTP(normalized_otp)) {
      return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 })
    }

    // Verify OTP against stored value
    const isValid = await verifyOTP(normalized_email, normalized_otp)

    if (!isValid.ok) {
      return NextResponse.json(
        { error: isValid.msg ?? 'Invalid or expired OTP' },
        { status: 401 }
      )
    }

    // Check if user exists in database
    if (await checkIfEmailExists(normalized_email)) {
      const user = await getUserDetails(normalized_email)

      if (!user) {
        return NextResponse.json(
          { error: 'Failed to retrieve user data. Please try again.' },
          { status: 500 }
        )
      }

      // Create HTTP-only session cookie
      await createSession({
        userId: user.email,
        email: user.email,
        name: user.fullName,
      })

      return NextResponse.json({ success: true, exists: true })
    } else {
      // New user — needs registration step
      return NextResponse.json({ success: true, exists: false })
    }
  } catch (error) {
    console.error('[OTP Verify] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}
