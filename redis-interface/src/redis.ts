import { redis } from "bun";
import { VALUES } from "./values";

import SCRIPT_DEDUCT_TOKEN from "./lua/token_deduct.lua" assert { type: "text" };
import SCRIPT_REFRESH_API_KEY from "./lua/refresh_api_key.lua" assert { type: "text" };
import SCRIPT_DELETE_API_KEY from "./lua/delete_api_key.lua" assert { type: "text" };
import SCRIPT_GRANT_TOKENS from "./lua/grant_tokens.lua" assert { type: "text" };

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

    const result = await redis.send("EVAL", [
      SCRIPT_DEDUCT_TOKEN,
      "2",
      PREFIX_LAST_UPDATED + __api_key,
      PREFIX_TOKEN_COUNT + __api_key,
      currentDate,
      DAILY_FREE_TOKEN_COUNT.toString(),
      __deduct_amount.toString(),
    ]);

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

    await redis.send("EVAL", [
      SCRIPT_GRANT_TOKENS,
      "4",
      PREFIX_LAST_UPDATED + __api_key,
      current_date.toString(),
      PREFIX_TOKEN_COUNT + __api_key,
      DAILY_FREE_TOKEN_COUNT.toString(),
    ]);
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
    const res = await redis.send("EVAL", [
      SCRIPT_DELETE_API_KEY,
      "2",
      PREFIX_LAST_UPDATED + __api_key,
      PREFIX_TOKEN_COUNT + __api_key,
    ]);

    return res !== VALUES.redisReturnCode.keyNotFound;
  } else {
    throw new Error("Redis is not connected");
  }
}

export async function refreshApiKey(__api_key: string) {
  if (redis) {
    const currentDate = new Date().toISOString().split("T")[0];
    const res = await redis.send("EVAL", [
      SCRIPT_REFRESH_API_KEY,
      "2",
      PREFIX_LAST_UPDATED + __api_key,
      PREFIX_TOKEN_COUNT + __api_key,
      currentDate,
      DAILY_FREE_TOKEN_COUNT.toString(),
    ]);

    return res !== VALUES.redisReturnCode.keyNotFound;
  } else {
    throw new Error("Redis is not connected");
  }
}
