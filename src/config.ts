export const { NODE_ENV = "development" } = process.env;

// =====================================================================================================================
// Config
// =====================================================================================================================
// Config — Directly from ENV or reasonable defaults for the environment

export const {
  // General
  PORT = 80,
  LANGUAGE,
  LOCALE,

  // 3rd party : OpenAI
  OPENAI_TOKEN,
  OPENAI_MODEL = "gpt-3.5-turbo",
  OPENAI_ASSISTANT_CALENDAR_ASSISTANT_ID,
  OPENAI_USER_FIRSTNAME,

  // 3rd party : Home Assistant
  HOME_ASSISTANT_HOST,
  HOME_ASSISTANT_PORT_RAW,
  HOME_ASSISTANT_TOKEN,

  HOME_ASSISTANT_MEDIA_PLAYER,

  // 3rd party : Google
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT_URL = "http://localhost:80/oauth2callback",
  GOOGLE_CLIENT_TOKEN_FILE_PATH = "token.json",
  GOOGLE_CLIENT_SCOPES:
    GOOGLE_CLIENT_SCOPES_RAW = "https://www.googleapis.com/auth/calendar.events", // Comma separated list of scopes

  // 3rd party : OpenAI
} = process.env;

// Config parsing
// =====================================================================================================================
export const HOME_ASSISTANT_PORT = parseInt(HOME_ASSISTANT_PORT_RAW, 10);
export const GOOGLE_CLIENT_SCOPES = GOOGLE_CLIENT_SCOPES_RAW.split(",");
