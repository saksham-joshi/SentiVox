import { Redis } from '@upstash/redis'
import { configDotenv } from 'dotenv'

configDotenv()

const OTP_REDIS_URL = process.env.UPSTASH_OTP_REDIS_URL
const OTP_REDIS_TOKEN = process.env.UPSTASH_OTP_REDIS_TOKEN

const APIKEY_REDIS_URL = process.env.UPSTASH_API_KEY_REDIS_URL
const APIKEY_REDIS_TOKEN = process.env.UPSTASH_API_KEY_REDIS_TOKEN

if (!OTP_REDIS_URL || !OTP_REDIS_TOKEN || !APIKEY_REDIS_URL || !APIKEY_REDIS_TOKEN) {
  console.error(
    "[FAILED TO LOAD REDIS ENV VARIABLES]"
  )
  process.exit(1)
}

const OTP_REDIS = new Redis({
  url: OTP_REDIS_URL,
  token: OTP_REDIS_TOKEN
})

if (!OTP_REDIS) {
  console.error('[FAILED TO CONNECT TO THE OTP REDIS]')
  process.exit(1)
}

const APIKEY_REDIS = new Redis({
  url: APIKEY_REDIS_URL,
  token: APIKEY_REDIS_TOKEN
})

if (!APIKEY_REDIS) {
  console.error('[FAILED TO CONNECT TO THE APIKEY REDIS]')
  process.exit(1)
}

export async function awakeRedis(): Promise<boolean> {
  try {
    await OTP_REDIS.exists('GetsugaTenshou')
    await APIKEY_REDIS.exists('GetsugaTenshou')

    return true
  } catch (err) {
    console.error('Error: ' + err)
  }

  return false
}
