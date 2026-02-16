import { redis } from "bun";

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

// await getAllRedisValues();

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

// await deleteTestApiKeys()
// await getAllRedisValues()

export async function getRedisValue(key: string) {
  if (!redis) {
    throw new Error("Redis is not connected");
  }

  const value = await redis.get(key);
  console.log(value);

  return value;
}

// getRedisValue("test-api-1771053000798")

export function generateRandomString(__len: number) {
  const characters =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789_-";
  const ar = new Uint8Array(__len);

  crypto.getRandomValues(ar);

  let randomstring = "sv-"; // avoiding number

  for (let i of ar) {
    randomstring += characters[i % characters.length];
  }

  console.log(randomstring);

  return randomstring;
}
