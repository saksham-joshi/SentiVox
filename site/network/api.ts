import { DOCS } from "@/lib/docs";
import { VALUES } from "@/lib/values";
import { JSON_KEYS } from "@/lib/keys";

const API_URL = VALUES.ANALYZER_API;
const ENDPOINTS = {
  SINGLE_COMMENT_ANALYSIS:
    DOCS.ENDPOINTS["context-free-analysis"]["single-comment-analysis"].endpoint,
  HEALTH_CHECK: DOCS.ENDPOINTS.utility.Health.endpoint,
};

const API_KEY_LEN = 64;
const CHARS_IN_API_KEY =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

export function generateApiKey() {
  const randomValues = new Uint8Array(API_KEY_LEN);

  crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((x) => CHARS_IN_API_KEY[x % CHARS_IN_API_KEY.length])
    .join("");
}

export interface AnalysisResult {
  sentiment: "Positive" | "Negative" | "Neutral";
  polarity_score: number;
  positive_score: number;
  negative_score: number;
  keywords: { [key: string]: number };
  positive_words: string[];
  negative_words: string[];
  unidentified_words: string[];
  word_cloud?: string;
  originalText: string;
}

function createSingleCommentAnalysisRequestBody(
  __comment: string,
  __apiKey: string
) {
  return {
    [JSON_KEYS.apiKey]: __apiKey,
    [JSON_KEYS.comment]: __comment,
  };
}

function convertToAnalysisResult(__data: {
  [key: string]: any;
}): AnalysisResult {
  return {
    sentiment: __data[JSON_KEYS.sentiment] || "Neutral",
    polarity_score: __data[JSON_KEYS.polarityScore] || 0,
    positive_score: __data[JSON_KEYS.positiveScore] || 0,
    negative_score: __data[JSON_KEYS.negativeScore] || 0,
    keywords: __data[JSON_KEYS.keywords] || {},
    positive_words: __data[JSON_KEYS.positiveWords] || [],
    negative_words: __data[JSON_KEYS.negativeWords] || [],
    unidentified_words: __data[JSON_KEYS.unidentifiedWords] || [],
    word_cloud: __data[JSON_KEYS.wordCloud] || "",
    originalText: "",
  };
}

export async function analyzeSingleComment(
  __comment: string,
  __apiKey: string
) {
  const __body = createSingleCommentAnalysisRequestBody(__comment, __apiKey);
  const __response = await fetch(
    `${API_URL}${ENDPOINTS.SINGLE_COMMENT_ANALYSIS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(__body),
    }
  );
  const __data = await __response.json();

  if (!__response.ok) {
    console.error(JSON.stringify(__data));
    throw new Error(__data.error);
  }

  const result = convertToAnalysisResult(__data);

  result.originalText = __comment;

  return result;
}

export async function addFreeTokens(__api_key: string) : Promise<boolean> {

  const password = process.env.FREE_TOKEN_PASSWORD || null;

  if (!password) {
    console.error("MISSING .ENV 'FREE_TOKEN_PASSWORD'");
  }

  try {
    const __response = await fetch(`${API_URL}/grantFreeTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [JSON_KEYS.apiKey]: __api_key,
        [JSON_KEYS.password]: password,
      }),
    });
    const __data = await __response.json();

    if (!__response.ok) {
      console.error(JSON.stringify(__data));
      throw new Error(__data.error);
    }

    return true;
  } catch (err) {
    console.error("Failed to add free tokens: " + err);
  }

  return false;
}

export async function getTokenCount(__api_key: string): Promise<number> {
  const __response = await fetch(`${API_URL}/tokenCount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      [JSON_KEYS.apiKey]: __api_key,
    }),
  });

  const __data = await __response.json();

  if (!__response.ok) {
    console.error(JSON.stringify(__data));
    throw new Error(__data.error);
  }

  return __data[JSON_KEYS.tokenCount];
}
