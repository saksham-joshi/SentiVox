'use server'

import { Redis } from '@upstash/redis'
import { OTP_CONFIGS, OTP_REDIS_RETURN_VALUES } from './values'
import { sendOTPMail } from '../mail/mail'

const REDIS_URL = process.env.OTP_REDIS_URL
const REDIS_TOKEN = process.env.OTP_REDIS_TOKEN

if (!REDIS_URL || !REDIS_TOKEN) {
  console.error("Cannot load 'OTP REDIS' CREDENTIALS")
  process.exit(1)
}

const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
})

if (!redis) {
  console.error("Cannot connect to 'OTP Redis'")
  process.exit(1)
}

export async function generateOTP(): Promise<string> {
  const randomValues = new Uint8Array(OTP_CONFIGS.otpLength)
  crypto.getRandomValues(randomValues)

  return Array.from(randomValues)
    .map((x) => OTP_CONFIGS.charsInOTP[x % OTP_CONFIGS.charsInOTP.length])
    .join('')
}

async function addOTP(
  __email: string,
  __otp: string
): Promise<{ ok: boolean; msg?: string }> {
  try {
    const result = await redis.eval(
      OTP_CONFIGS.scripts.addOTP,
      [],
      [__email, __otp]
    )

    if (result == OTP_REDIS_RETURN_VALUES.otpAdded) return { ok: true }
    else if (result == OTP_REDIS_RETURN_VALUES.otpAlreadyExists)
      return { ok: false, msg: 'OTP Already exists with the same email' }
    else if (result == OTP_REDIS_RETURN_VALUES.otpMaxTryHit)
      return {
        ok: false,
        msg: 'You cannot login with this email for the next 10 minutes',
      }

    return {
      ok: false,
      msg: 'There is something wrong with the OTP system. Please report this issue with the developers',
    }
  } catch (err) {
    console.error(err)

    return {
      ok: false,
      msg: err?.toString() ?? 'Something went wrong',
    }
  }
}

export async function verifyOTP(
  __email: string,
  __otp: string
): Promise<{ ok: boolean; msg?: string; code?: number }> {
  try {
    const result = await redis.eval(
      OTP_CONFIGS.scripts.verifyOTP,
      [__email],
      [__otp]
    )

    if (result == OTP_REDIS_RETURN_VALUES.otpCorrect) return { ok: true }
    else if (result == OTP_REDIS_RETURN_VALUES.otpIncorrect)
      return { ok: false, msg: 'Incorrect OTP' }
    else if (result == OTP_REDIS_RETURN_VALUES.otpExpired)
      return { ok: false, msg: 'OTP Expired' }
    else if (result == OTP_REDIS_RETURN_VALUES.otpMaxTryHit)
      return {
        ok: false,
        msg: "You won't be able to login for next 10 minutes because either you logged in with this email in the past 10 minutes or retried more than 3 times with incorrect OTP",
      }
    else
      return {
        ok: false,
        msg: 'There is something wrong with the OTP system. Please report this issue with the developers',
      }
  } catch (err) {
    console.error(err)

    return {
      ok: false,
      msg: err?.toString() ?? 'Something went wrong',
    }
  }
}

export async function sendOTP(__email: string) {
  const otp = await generateOTP()

  const output = await addOTP(__email, otp)

  if (output.ok && (await sendOTPMail(__email, otp))) return output

  return {
    ok: false,
    msg: output.ok ? 'Error while sending OTP mail' : output.msg,
  }
}

export async function blacklistJWT(
  __token: string,
  __remaining_ttl_in_seconds: number
): Promise<{ ok: boolean; msg?: string }> {
  try {
    if (redis) {
      await redis.setex(
        `${OTP_CONFIGS.prefix.blacklistJWT}${__token}`,
        __remaining_ttl_in_seconds,
        1
      )
    }

    return {
      ok: true,
    }
  } catch (err) {
    console.error(err)
    return {
      ok: false,
      msg: String(err),
    }
  }
}

export async function isBlacklistedJWT(__token: string): Promise<boolean> {
  try {
    return (
      (await redis.exists(`${OTP_CONFIGS.prefix.blacklistJWT}${__token}`)) === 1
    )
  } catch (err) {
    console.error(err)
  }

  return false
}
