export const { NODE_ENV = "development" } = process.env;

// Default values depending on the environment
const DEFAULT_HOME_ASSISTANT_HOST =
  NODE_ENV === "production"
    ? "http://supervisor/core"
    : "http://homeassistant.local";
const DEFAULT_HOME_ASSISTANT_PORT = NODE_ENV === "production" ? "80" : "8123";
const DEFAULT_HOME_ASSISTANT_TOKEN = process.env.SUPERVISOR_TOKEN;
const DEFAULT_UPDATE_INTERVAL = NODE_ENV === "production" ? "3600000" : "10000"; // Every hour in production, every 5 seconds in dev

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
  HOME_ASSISTANT_HOST = DEFAULT_HOME_ASSISTANT_HOST,
  HOME_ASSISTANT_PORT_RAW = DEFAULT_HOME_ASSISTANT_PORT,
  HOME_ASSISTANT_TOKEN = DEFAULT_HOME_ASSISTANT_TOKEN,

  HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL:
    HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL_RAW = DEFAULT_UPDATE_INTERVAL,
  HOME_ASSISTANT_SUMMARIES_DEVICE_ENTITY_PREFIX = "summary_device_", // Use for the summary entities we will create. will be followed by the device name
  HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES:
    HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES_RAW = "hall_tablet,iphone_thomas,iphone_caroline,macbookpro_thomas,roborock,octoprint,litterbox,toothbrush,pet_feeder,pet_fountain",

  HOME_ASSISTANT_MEDIA_PLAYER,

  // 3rd party : Google
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT_URL = "http://localhost:80/oauth2callback",
  GOOGLE_CLIENT_TOKEN_FILE_PATH = "token.json",
  GOOGLE_CLIENT_CREDENTIALS_FILE_PATH = "credentials.json",
  GOOGLE_CLIENT_SCOPES:
    GOOGLE_CLIENT_SCOPES_RAW = "https://www.googleapis.com/auth/calendar.events", // Comma separated list of scopes

  // 3rd party : OpenAI
} = process.env;

// Config parsing
// =====================================================================================================================
export const HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL = parseInt(
  HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL_RAW,
  10,
);
export const HOME_ASSISTANT_PORT = parseInt(HOME_ASSISTANT_PORT_RAW, 10);

export const HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES =
  HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES_RAW.split(",");
export const GOOGLE_CLIENT_SCOPES = GOOGLE_CLIENT_SCOPES_RAW.split(",");
