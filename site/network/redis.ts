"use server"

import { VALUES } from "@/lib/values";

const PASSWORD_FREE_TOKEN = process.env.FREE_TOKEN_PASSWORD || null;
const PASSWORD_DELETE_API_KEY = process.env.DELETE_API_KEY_PASSWORD || null;

if(!PASSWORD_FREE_TOKEN || !PASSWORD_DELETE_API_KEY)
{
    console.error("CANNOT FIND ENV VARIABLES FOR REDIS INTERFACE!");
}

const REDIS_INTERFACE_URL = VALUES.REDIS_INTERFACE_API;
const REDIS_INTERFACE_ROUTES = {
  getTokenCount: "/getTokenCount",
  grantFreeTokens: "/grantFreeTokens",
  verifyApiKey: "/verifyApiKey",
  health: "/health",
  deductToken: "/deductToken",
  deleteApiKey: "/deleteApiKey",
  refreshApiKey: "/refreshApiKey",
};
const REDIS_INTERFACE_JSON_KEYS = {
  apiKey: "api-key",
  tokenCount: "token-count",
  password: "password",
  result: "result",
  error: "error",
};

export async function getTokenCount(__api_key: string): Promise<number> {
  const response = await fetch(
    `${REDIS_INTERFACE_URL}${REDIS_INTERFACE_ROUTES.getTokenCount}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [REDIS_INTERFACE_JSON_KEYS.apiKey]: __api_key,
      }),
    }
  );

  const data = await response.json();

  if (data[REDIS_INTERFACE_JSON_KEYS.error]) {
    throw new Error(data[REDIS_INTERFACE_JSON_KEYS.error]);
  }

  return data[REDIS_INTERFACE_JSON_KEYS.tokenCount] as number;
}

export async function grantFreeTokens(__api_key: string): Promise<boolean> {
  const response = await fetch(
    `${REDIS_INTERFACE_URL}${REDIS_INTERFACE_ROUTES.grantFreeTokens}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [REDIS_INTERFACE_JSON_KEYS.apiKey]: __api_key,
        [REDIS_INTERFACE_JSON_KEYS.password]: PASSWORD_FREE_TOKEN
      }),
    }
  );

  const data = await response.json();

  if (data[REDIS_INTERFACE_JSON_KEYS.error]) {
    throw new Error(data[REDIS_INTERFACE_JSON_KEYS.error]);
  }

  return data[REDIS_INTERFACE_JSON_KEYS.result] as boolean;
}

export async function deleteApiKey(__api_key: string): Promise<boolean> {
  const response = await fetch(
    `${REDIS_INTERFACE_URL}${REDIS_INTERFACE_ROUTES.deleteApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [REDIS_INTERFACE_JSON_KEYS.apiKey]: __api_key,
        [REDIS_INTERFACE_JSON_KEYS.password]: PASSWORD_DELETE_API_KEY
      }),
    }
  );

  const data = await response.json();

  if (data[REDIS_INTERFACE_JSON_KEYS.error]) {
    throw new Error(data[REDIS_INTERFACE_JSON_KEYS.error]);
  }

  return data[REDIS_INTERFACE_JSON_KEYS.result] as boolean;
}

export async function refreshApiKey(__api_key: string): Promise<boolean> {
  const response = await fetch(
    `${REDIS_INTERFACE_URL}${REDIS_INTERFACE_ROUTES.refreshApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [REDIS_INTERFACE_JSON_KEYS.apiKey]: __api_key,
      }),
    }
  );

  if(!response.ok)
  {
    console.error("API KEY REFRESH FAILED!");
    return false;
  }

  const data = await response.json();

  if (data[REDIS_INTERFACE_JSON_KEYS.error]) {
    throw new Error(data[REDIS_INTERFACE_JSON_KEYS.error]);
  }

  return data[REDIS_INTERFACE_JSON_KEYS.result] as boolean;
}
