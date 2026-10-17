import { NextRequest, NextResponse } from 'next/server'
import { VALUES } from '@/lib/values'
import { sendOTP } from '@/api/otp/otp'
import { isValidEmail } from '@/lib/validator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

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

    // Send OTP
    const otp_sent_result = await sendOTP(normalizedEmail)

    if (otp_sent_result.ok) return NextResponse.json({ success: true })

    return NextResponse.json(
      { error: otp_sent_result.msg ?? 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
