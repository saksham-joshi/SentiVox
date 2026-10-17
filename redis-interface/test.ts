import { describe, expect, test } from "bun:test";
import { VALUES } from "./src/values";

// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://sentivox-redis-interface.onrender.com";

const API_KEY = "test-api-123";
const NEW_API_KEY = "test-api-456";

const FREE_TOKEN_PASSWORD = process.env.FREE_TOKEN_PASSWORD;
const DEDUCT_TOKEN_PASSWORD = process.env.DEDUCT_TOKEN_PASSWORD;
const DELETE_API_KEY_PASSWORD = process.env.DELETE_API_KEY_PASSWORD;
const ROTATE_API_KEY_PASSWORD = process.env.ROTATE_API_KEY_PASSWORD;

if (
  !FREE_TOKEN_PASSWORD ||
  !DEDUCT_TOKEN_PASSWORD ||
  !DELETE_API_KEY_PASSWORD ||
  !ROTATE_API_KEY_PASSWORD
) {
  console.error(
    "WARNING: Passwords not found in env. Tests requiring authorization might fail."
  );
  process.exit(1)
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
      VALUES.dailyFreeTokenCount
    );
  });

  test("Deduct Tokens", async () => {
    
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
      VALUES.dailyFreeTokenCount - deductAmount
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

  test("Rotating API Key", async () => {
    const res1 = await fetch(`${BASE_URL}${VALUES.routes.rotateApiKey}`, {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.oldApiKey]: API_KEY,
        [VALUES.jsonKeys.newApiKey]: NEW_API_KEY,
        [VALUES.jsonKeys.password]: ROTATE_API_KEY_PASSWORD
      })
    });
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1[VALUES.jsonKeys.result]).toBe(true);

    // deduct token script takes both token count and last updated into account
    // so to check if rotation worked well it is a good testcase
    const res2 = await fetch(`${BASE_URL}${VALUES.routes.deductToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: NEW_API_KEY,
        [VALUES.jsonKeys.password]: DEDUCT_TOKEN_PASSWORD,
        [VALUES.jsonKeys.tokenCount]: 100,
      }),
    });
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2[VALUES.jsonKeys.result]).toBe(true);
  });

  test("Delete API Key", async () => {
    const res = await fetch(`${BASE_URL}${VALUES.routes.deleteApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [VALUES.jsonKeys.apiKey]: NEW_API_KEY,
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
        [VALUES.jsonKeys.apiKey]: NEW_API_KEY,
      }),
    });
    const verifyData = await verifyRes.json();
    expect(verifyData[VALUES.jsonKeys.result]).toBe(false);
  });
});
