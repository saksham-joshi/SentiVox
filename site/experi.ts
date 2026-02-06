const API_KEY_LEN = 64;
const CHARS_IN_API_KEY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

export function generateApiKey() {
  const randomValues = new Uint8Array(API_KEY_LEN);

  crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((x) => CHARS_IN_API_KEY[x % CHARS_IN_API_KEY.length])
    .join("");
}

for(var i = 0; i < 5; ++i){console.log(generateApiKey())}