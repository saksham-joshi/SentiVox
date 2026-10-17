import { OTP_CONFIGS } from '@/api/otp/values'
import { VALUES } from './values'

// Name validation: alphabets and spaces only, max 19 characters
export function isValidName(name: string): boolean {
  const nameRegex = /^[A-Za-z\s]+$/
  return nameRegex.test(name) && name.length >= 2 && name.length <= 19
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false

  return VALUES.ALLOWED_EMAIL_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(domain)
  )
}

export function isValidOTP(__otp: string): boolean {
  if (__otp.length !== OTP_CONFIGS.otpLength) return false

  for (let i = 0; i < __otp.length; ++i) {
    if (!OTP_CONFIGS.charsInOTP.includes(__otp[i])) return false
  }

  return true
}
