import { Redis } from "@upstash/redis";
import { VALUES } from "./values";
import SCRIPT_REDIS_TOKEN_DEDUCT from "./lua/token_deduct.lua" assert { type : "text" }
import SCRIPT_REDIS_DELETE_API_KEY from "./lua/delete_api_key.lua" assert { type : "text" }
import SCRIPT_REDIS_REFRESH_API_KEY from "./lua/refresh_api_key.lua" assert { type : "text" }
import SCRIPT_REDIS_GRANT_TOKENS from "./lua/grant_tokens.lua" assert { type : "text" }
import SCRIPT_REDIS_ROTATE_API_KEY from "./lua/rotate_api_key.lua" assert { type : "text" }

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

const PREFIX_LAST_UPDATED = VALUES.prefix.lastUpdated;
const PREFIX_TOKEN_COUNT = VALUES.prefix.tokenCount;
const DAILY_FREE_TOKEN_COUNT = VALUES.dailyFreeTokenCount;

/*
 * On redis the data format is like this:
 *
 * For tokens count
 *   "TC:[api_key" = token_count
 *
 * For last updated
 *   "LU:[api_key" = last_updated_date
 */
export async function deductToken(__api_key: string, __deduct_amount: number) {
  if (redis) {
    const currentDate = new Date().toISOString().split("T")[0];

    const result = await redis.eval(
      SCRIPT_REDIS_TOKEN_DEDUCT,
      [
        PREFIX_LAST_UPDATED + __api_key,
        PREFIX_TOKEN_COUNT + __api_key
      ],
      [
        currentDate,
        DAILY_FREE_TOKEN_COUNT.toString(),
        __deduct_amount.toString()
      ]
    );

    // -1 = Not enough tokens (different from null)
    // -2 = Key doesn't exist
    if (result === -2 || result === -1) {
      return null;
    }

    return result;
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function getTokenCount(__api_key: string) {
  if (redis) {
    return await redis.get(PREFIX_TOKEN_COUNT + __api_key);
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function grantFreeTokens(__api_key: string): Promise<boolean> {
  if (redis) {
    const current_date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await redis.eval(
      SCRIPT_REDIS_GRANT_TOKENS,
      [
        PREFIX_LAST_UPDATED + __api_key,
        current_date.toString(),
        PREFIX_TOKEN_COUNT + __api_key,
        DAILY_FREE_TOKEN_COUNT.toString()
      ],
      []
    );
  } else {
    throw new Error("Redis is not connected");
  }

  return true;
}

export async function verifyApiKey(__api_key: string): Promise<boolean> {
  if (redis) {
    const res = await redis.get(PREFIX_TOKEN_COUNT + __api_key);
    return res !== null;
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function deleteApiKey(__api_key: string): Promise<boolean> {
  if (redis) {
    const res = await redis.eval(
      SCRIPT_REDIS_DELETE_API_KEY,
      [
        PREFIX_LAST_UPDATED + __api_key,
        PREFIX_TOKEN_COUNT + __api_key,
      ],
      []
    );

    return res !== VALUES.redisReturnCode.keyNotFound;
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function refreshApiKey(__api_key: string) {
  if (redis) {
    const currentDate = new Date().toISOString().split("T")[0];

    const res = await redis.eval(
      SCRIPT_REDIS_REFRESH_API_KEY,
      [
        PREFIX_LAST_UPDATED + __api_key,
        PREFIX_TOKEN_COUNT + __api_key,
      ],
      [
        currentDate,
        DAILY_FREE_TOKEN_COUNT.toString(),
      ]
    );

    return res !== VALUES.redisReturnCode.keyNotFound;
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function rotateApiKey(__old_api_key : string, __new_api_key : string) {
  if(redis) {
    const res = await redis.eval (
      SCRIPT_REDIS_ROTATE_API_KEY,
      [
        PREFIX_TOKEN_COUNT + __old_api_key,
        PREFIX_LAST_UPDATED + __old_api_key
      ],
      [
        PREFIX_TOKEN_COUNT + __new_api_key,
        PREFIX_LAST_UPDATED + __new_api_key
      ]
    )

    return res === VALUES.redisReturnCode.success
  }
  else {
    throw new Error("Redis is not connected");
  }
}