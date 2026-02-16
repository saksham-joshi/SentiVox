import { Elysia } from "elysia";
import { VALUES } from "./values";
import {
  handle_deductToken,
  handle_deleteApiKey,
  handle_getTokenCount,
  handle_grantFreeTokens,
  handle_refreshApiKey,
  handle_verifyApiKey,
} from "./handler";

const app = new Elysia()
  .get(VALUES.routes.health, () => "[Perfect]")
  .post(VALUES.routes.getTokenCount, handle_getTokenCount)
  .post(VALUES.routes.grantFreeTokens, handle_grantFreeTokens)
  .post(VALUES.routes.verifyApiKey, handle_verifyApiKey)
  .post(VALUES.routes.deleteApiKey, handle_deleteApiKey)
  .post(VALUES.routes.refreshApiKey, handle_refreshApiKey)
  .post(VALUES.routes.deductToken, handle_deductToken)
  .post("*", async ({ set }) => {
    set.status = VALUES.statusCode.invalidEndpoint;
    return { [VALUES.jsonKeys.error]: "Invalid Endpoint" };
  })
  .get("*", async ({ set }) => {
    set.status = VALUES.statusCode.invalidEndpoint;
    return { [VALUES.jsonKeys.error]: "Invalid Endpoint" };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
