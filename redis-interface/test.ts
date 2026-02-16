import { describe, expect, test } from "bun:test";
import { VALUES } from "./src/values";

const BASE_URL = "http://localhost:3000";
// const API_KEY = "test-api-" + Date.now();
const API_KEY = "test-api-123";

const FREE_TOKEN_PASSWORD = process.env.FREE_TOKEN_PASSWORD;
const DEDUCT_TOKEN_PASSWORD = process.env.DEDUCT_TOKEN_PASSWORD;
const DELETE_API_KEY_PASSWORD = process.env.DELETE_API_KEY_PASSWORD;

if (
  !FREE_TOKEN_PASSWORD ||
  !DEDUCT_TOKEN_PASSWORD ||
  !DELETE_API_KEY_PASSWORD
) {
  console.warn(
    "WARNING: Passwords not found in env. Tests requiring authorization might fail."
  );
}

describe("Redis Interface API", () => {
  test("Health Check", async () => {
    const res = await fetch(`${BASE_URL}${VALUES.routes.health}`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("[Perfect]");
  });

  test("Grant Free Tokens", async () => {
    const res = await fetch(`${BASE_URL}${VALUES.routes.grantFreeTokens}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
        [VALUES.jsonKeys.password]: FREE_TOKEN_PASSWORD,
      }),
    });
    expect(res.status).toBe(200);

    // Verify grant
    const countRes = await fetch(`${BASE_URL}${VALUES.routes.getTokenCount}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
      }),
    });
    const data = await countRes.json();
    expect(data[VALUES.jsonKeys.tokenCount]).toBe(
      `${VALUES.dailyFreeTokenCount}`
    );
  });

  test("Deduct Tokens", async () => {
    // Ensure we have tokens first
    await fetch(`${BASE_URL}${VALUES.routes.grantFreeTokens}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
        [VALUES.jsonKeys.password]: FREE_TOKEN_PASSWORD,
      }),
    });

    const deductAmount = 100;
    const res = await fetch(`${BASE_URL}${VALUES.routes.deductToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
        [VALUES.jsonKeys.password]: DEDUCT_TOKEN_PASSWORD,
        [VALUES.jsonKeys.tokenCount]: deductAmount,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[VALUES.jsonKeys.result]).toBe(true);

    const countRes = await fetch(`${BASE_URL}${VALUES.routes.getTokenCount}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
      }),
    });
    const countData = await countRes.json();
    expect(countData[VALUES.jsonKeys.tokenCount]).toBe(
      (VALUES.dailyFreeTokenCount - deductAmount).toString()
    );
  });

  test("Refresh API Key", async () => {
    // Ensure existence
    await fetch(`${BASE_URL}${VALUES.routes.grantFreeTokens}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
        [VALUES.jsonKeys.password]: FREE_TOKEN_PASSWORD,
      }),
    });

    const res = await fetch(`${BASE_URL}${VALUES.routes.refreshApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[VALUES.jsonKeys.result]).toBe(true);
  });

  test("Delete API Key", async () => {
    const res = await fetch(`${BASE_URL}${VALUES.routes.deleteApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
        [VALUES.jsonKeys.password]: DELETE_API_KEY_PASSWORD,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[VALUES.jsonKeys.result]).toBe(true);

    const verifyRes = await fetch(`${BASE_URL}${VALUES.routes.verifyApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: API_KEY,
      }),
    });
    const verifyData = await verifyRes.json();
    expect(verifyData[VALUES.jsonKeys.result]).toBe(false);
  });
});
