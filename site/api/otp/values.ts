export const OTP_REDIS_RETURN_VALUES = {
  otpAdded: 0,
  otpAlreadyExists: 1,
  otpCorrect: 2,
  otpIncorrect: 3,
  otpMaxTryHit: 4,
  otpExpired: 5,
  unexpectedIssueFound: 6,
} as const

import SCRIPT_ADD_OTP from '@/lua/add_otp.lua' assert { type: 'text' }
import SCRIPT_VERIFY_OTP from '@/lua/verify_otp.lua' assert { type: 'text' }

export const OTP_CONFIGS = {
  otpLength: 6,
  maxTryAllowed: 3,
  expireTimeInSeconds: 300, // otp will expire in X seconds
  banTimeInSeconds: 600, // user won't be able to request new OTP for that email
  charsInOTP: 'abcdefghjkmnopqrstuvwxyz0123456789',
  scripts: {
    addOTP: SCRIPT_ADD_OTP,
    verifyOTP: SCRIPT_VERIFY_OTP,
  },
  prefix: {
    blacklistJWT: 'blklst:',
  },
} as const
