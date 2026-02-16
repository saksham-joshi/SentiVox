export const VALUES = {
  appName: "Senti-Vox Redis Interface",
  dailyFreeTokenCount: 10000,
  prefix: {
    lastUpdated: "LU:[",
    tokenCount: "TC:[",
  },
  jsonKeys: {
    apiKey: "api-key",
    tokenCount: "token-count",
    password: "password",
    result: "result",
    error: "error",
  },
  routes: {
    getTokenCount: "/getTokenCount",
    grantFreeTokens: "/grantFreeTokens",
    verifyApiKey: "/verifyApiKey",
    health: "/health",
    deductToken: "/deductToken",
    deleteApiKey: "/deleteApiKey",
    refreshApiKey: "/refreshApiKey",
  },
  statusCode: {
    success: 200,
    invalidJsonFormat: 400,
    missingOrInvalidAuth: 401,
    invalidEndpoint: 404,
    validRequestButFailedValidation: 422,
  },
  redisReturnCode: {
    success: 0,
    notEnoughTokens: -1,
    keyNotFound: -2,
  },
} as const;
