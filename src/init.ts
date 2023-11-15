import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import homeassistant from "homeassistant";
import OpenAI from "openai";
import prompt from "prompt";

import { setClient as haSetClient } from "./home-assistant/client";
import { setClient as openaiSetClient } from "./openai/client";
import { setClient as googleSetClient } from "./google/client";

import {
  authorize as googleAuthorize,
  handleAuthCallback as googleHandleAuthCallback,
} from "./google/auth";

import {
  HOME_ASSISTANT_TOKEN,
  HOME_ASSISTANT_HOST,
  HOME_ASSISTANT_PORT,
  OPENAI_TOKEN,
  PORT,
} from "./config";
import { log } from "./_helpers/logs";

/**
 * Initializes the application by setting up Home Assistant and OpenAI.
 *
 * @returns {Promise<{ha: homeassistant, openai: OpenAI, google: google.auth.OAuth2, prompt: prompt}>} - Promise that resolves to the initialized objects.
 */
export async function init(): Promise<{
  ha: homeassistant;
  openai: OpenAI;
  server: express.Express;
  google: google.auth.OAuth2;
  prompt: prompt;
}> {
  // Home Assistant
  // ===================================================================================================================
  const ha: homeassistant = new homeassistant({
    host: HOME_ASSISTANT_HOST,
    port: HOME_ASSISTANT_PORT,
    token: HOME_ASSISTANT_TOKEN,
  });
  const haStatus = await ha.status();
  haSetClient(ha);
  log("ha", "debug", haStatus.message);

  // OpenAI
  // ===================================================================================================================
  const openai = new OpenAI({
    apiKey: OPENAI_TOKEN,
  });
  openaiSetClient(openai);
  log("openai", "debug", "Initialized.");

  // Express Server
  // ===================================================================================================================
  const server = express();
  server.use(bodyParser());

  // Register routes
  googleHandleAuthCallback(server);

  // Listen
  server.listen(PORT, (err) => {
    if (err) throw err;
    log("server", "info", `Listening on port ${PORT}`);
  });

  // Google OAuth2 — Trigger authentication flow
  // ===================================================================================================================
  // Express needs to be initialized before this, so we are ready to handle the callback
  const google = await googleAuthorize();
  googleSetClient(google);

  return { ha, openai, google, server, prompt };
}
