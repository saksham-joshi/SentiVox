import {
  deductToken,
  deleteApiKey,
  getTokenCount,
  grantFreeTokens,
  refreshApiKey,
  verifyApiKey,
} from "./redis";
import { VALUES } from "./values";

const FREE_TOKEN_PASSWORD = process.env.FREE_TOKEN_PASSWORD;
const DEDUCT_TOKEN_PASSWORD = process.env.DEDUCT_TOKEN_PASSWORD;
const DELETE_API_KEY_PASSWORD = process.env.DELETE_API_KEY_PASSWORD;

if (
  !FREE_TOKEN_PASSWORD ||
  !DEDUCT_TOKEN_PASSWORD ||
  !DELETE_API_KEY_PASSWORD
) {
  console.error("CANNOT FIND ENV VARIABLE FOR PASSWORDS");
}

export async function handle_getTokenCount({ body, set }: any) {
  try {
    const { [VALUES.jsonKeys.apiKey]: apiKey } = body as {
      [VALUES.jsonKeys.apiKey]: string;
    };

    if (!apiKey) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key" };
    }

    const token_count = await getTokenCount(apiKey);

    set.status = VALUES.statusCode.success;
    if (token_count === null) {
      return { error: "Invalid API Key" };
    }
    return {
      [VALUES.jsonKeys.tokenCount]: token_count,
    };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}

export async function handle_grantFreeTokens({ body, set }: any) {
  try {
    const {
      [VALUES.jsonKeys.apiKey]: apiKey,
      [VALUES.jsonKeys.password]: password,
    } = body as {
      [VALUES.jsonKeys.apiKey]: string;
      [VALUES.jsonKeys.password]: string;
    };

    if (!apiKey || !password) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key or/and Password" };
    }

    if (password === FREE_TOKEN_PASSWORD) {
      set.status = VALUES.statusCode.success;

      return { [VALUES.jsonKeys.result]: await grantFreeTokens(apiKey) };
    }

    set.status = VALUES.statusCode.missingOrInvalidAuth;

    return { error: "Invalid Password!" };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}

export async function handle_verifyApiKey({ body, set }: any) {
  try {
    const { [VALUES.jsonKeys.apiKey]: apiKey } = body as {
      [VALUES.jsonKeys.apiKey]: string;
    };

    if (!apiKey) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key" };
    }

    set.status = VALUES.statusCode.success;

    return { [VALUES.jsonKeys.result]: await verifyApiKey(apiKey) };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}

export async function handle_deleteApiKey({ body, set }: any) {
  try {
    const {
      [VALUES.jsonKeys.apiKey]: apiKey,
      [VALUES.jsonKeys.password]: password,
    } = body as {
      [VALUES.jsonKeys.apiKey]: string;
      [VALUES.jsonKeys.password]: string;
    };

    if (!apiKey || !password) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key or/and Password" };
    }

    if (password === DELETE_API_KEY_PASSWORD) {
      set.status = VALUES.statusCode.success;

      return { [VALUES.jsonKeys.result]: await deleteApiKey(apiKey) };
    }

    set.status = VALUES.statusCode.missingOrInvalidAuth;

    return { error: "Invalid Password!" };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}

export async function handle_refreshApiKey({ body, set }: any) {
  try {
    const { [VALUES.jsonKeys.apiKey]: apiKey } = body as {
      [VALUES.jsonKeys.apiKey]: string;
    };

    if (!apiKey) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key" };
    }

    set.status = VALUES.statusCode.success;

    return { [VALUES.jsonKeys.result]: await refreshApiKey(apiKey) };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}

export async function handle_deductToken({ body, set }: any) {
  try {
    const {
      [VALUES.jsonKeys.apiKey]: apiKey,
      [VALUES.jsonKeys.password]: password,
      [VALUES.jsonKeys.tokenCount]: tokenCount,
    } = body as {
      [VALUES.jsonKeys.apiKey]: string;
      [VALUES.jsonKeys.password]: string;
      [VALUES.jsonKeys.tokenCount]: number;
    };

    if (!apiKey || !password) {
      set.status = VALUES.statusCode.missingOrInvalidAuth;
      return { error: "Missing API Key or/and Password" };
    }

    if (password === DEDUCT_TOKEN_PASSWORD) {
      set.status = VALUES.statusCode.success;

      const res = await deductToken(apiKey, tokenCount);

      return {
        [VALUES.jsonKeys.result]: res === null ? false : true,
      };
    }

    set.status = VALUES.statusCode.missingOrInvalidAuth;

    return { error: "Invalid Password!" };
  } catch (err) {
    console.error(err);
    return { [VALUES.jsonKeys.error]: err?.toString() };
  }
}
