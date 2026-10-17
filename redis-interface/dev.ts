import { Redis } from "@upstash/redis";

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

if(!UPSTASH_REDIS_URL || !UPSTASH_REDIS_TOKEN)
{
  console.error(">> [CANNOT LOAD ENVIRONMENT VARIABLES OF REDIS URL AND REDIS TOKEN]");
  process.exit(1);
}

const redis = new Redis({
  url: UPSTASH_REDIS_URL,
  token: UPSTASH_REDIS_TOKEN,
  enableTelemetry: false
});

if(!redis)
{
  console.error("\n [REDIS IS NOT CONNECTED]");
  process.exit(1);
}

export async function getAllRedisValues() {
  if (!redis) {
    throw new Error("Redis is not connected");
  }

  const keys = await redis.keys("*");
  const result: Record<string, string | null> = {};

  for (const key of keys) {
    const value = await redis.get(key);
    result[key] = value;
  }

  console.log(result);

  return result;
}

export async function deleteTestApiKeys() {
  if (redis) {
    const keys = await redis.keys("*");
    for (const key of keys) {
      if (key.includes("test-api-")) {
        await redis.del(key);
      }
    }
  } else {
    console.error("Error: Redis is not connected");
  }
}

export async function getRedisValue(key: string) {
  if (!redis) {
    throw new Error("Redis is not connected");
  }

  const value = await redis.get(key);
  console.log(value);

  return value;
}

export function generateRandomString(__len: number) {
  const characters =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789_-*!@#%^*()+|/><,.[]{}";
  const ar = new Uint8Array(__len);

  crypto.getRandomValues(ar);

  let randomstring = "sv-"; // avoiding number

  for (let i of ar) {
    randomstring += characters[i % characters.length];
  }

  console.log(randomstring);

  return randomstring;
}


// await deleteTestApiKeys()
// await getAllRedisValues()