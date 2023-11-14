import { google } from "googleapis";
import open from "open";
import { promises as fs } from "fs";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT_URL,
  GOOGLE_CLIENT_SCOPES,
  GOOGLE_CLIENT_TOKEN_FILE_PATH,
} from "../config";

import { setClient, google as googleClient } from "./client";
import { log, logLoading } from "../_helpers/logs";
import { sleep } from "../_helpers/sleep";

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {google.auth.OAuth2} client - The authenticated Google OAuth 2.0 client.
 * @returns {Promise<void>} - The Promise that resolves when the credentials have been saved.
 */
export async function saveCredentials(client) {
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(GOOGLE_CLIENT_TOKEN_FILE_PATH, payload);
  log("google", "debug", "Saved credentials to file.");
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(GOOGLE_CLIENT_TOKEN_FILE_PATH);
    const credentials = JSON.parse(content);
    log("google", "debug", "Loaded saved credentials from file.");
    return google.auth.fromJSON(credentials);
  } catch (err) {
    log("google", "debug", "No saved credentials found.");
    return null;
  }
}

/**
 * Deletes the saved credentials file.
 *
 * @return {Promise<void>}
 */
async function deleteSavedCredentials() {
  await fs.unlink(GOOGLE_CLIENT_TOKEN_FILE_PATH);
  log("google", "debug", "Deleted saved credentials file.");
}

/**
 * Triggers the Google OAuth2 authentication flow by opening a browser tab and redirecting the user to the
 * authentication page.
 * Checks if the client has a still valid token and only opens the url if not.
 */
export async function authorize(): Promise<google.auth.OAuth2> {
  // Saved Client
  // ===================================================================================================================
  const savedClient = await loadSavedCredentialsIfExist();
  // TODO: This is probably a bit weak of a validation, we should check the expiry date but we don't have it on the client object
  if (
    savedClient &&
    savedClient.credentials &&
    savedClient.credentials.refresh_token
  ) {
    log("google", "debug", "Valid token found, skipping authentication.");
    return savedClient;
  }

  // New Client
  // ===================================================================================================================
  // Delete old save client if needed
  try {
    await deleteSavedCredentials();
  } catch {
    // Ignore error
    log("google", "debug", "No saved credentials found to be deleted.");
  }

  // Create a fresh client and use it to trigger the authentication flow
  log(
    "google",
    "debug",
    "No valid token found, destroying old saved credentials and opening browser for authentication.",
  );
  const newClient = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_REDIRECT_URL,
  );
  const url = newClient.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_CLIENT_SCOPES,
  });
  open(url);
  // handleAuthCallback will take it from here and setClient so that googleClient is not null anymore
  while (googleClient === null) {
    logLoading("Waiting for Google Authentication");
    await sleep(1000);
  }
  return googleClient;
}

/**
 * Handles the OAuth2 callback from Google's authentication flow on a dedicated route and sets the credentials on the
 * OAuth2 client.
 *
 * @param {Object} server - The Express server object.
 */
export function handleAuthCallback(server) {
  server.get("/oauth2callback", async function (req, res) {
    // We just go a token!
    // Let's create a fresh client, append the token to it and use it to save the credentials to a file
    const newClient = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_CLIENT_REDIRECT_URL,
    );
    const code = req.query.code;
    newClient.getToken(code, function (err, tokens) {
      if (!err) {
        res.send("Authentication successful! Please return to the console.");
        console.log("tokens", tokens);
        newClient.setCredentials(tokens);
        saveCredentials(newClient);
        setClient(newClient);
      }
    });
  });
}
