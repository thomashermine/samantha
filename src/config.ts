export const {
    NODE_ENV = 'development',
} = process.env;

// Default values depending on the environment
const DEFAULT_HOME_ASSISTANT_HOST = (NODE_ENV === 'production') ? 'http://supervisor/core' : 'http://homeassistant.local';
const DEFAULT_HOME_ASSISTANT_PORT = (NODE_ENV === 'production') ? 80 : 8123;
const DEFAULT_HOME_ASSISTANT_TOKEN = process.env.SUPERVISOR_TOKEN;

// =====================================================================================================================
// Config
// =====================================================================================================================
// Config — Directly from ENV or reasonable defaults for the environment

export const {
    OPENAI_TOKEN, 
    HOME_ASSISTANT_HOST = DEFAULT_HOME_ASSISTANT_HOST,
    HOME_ASSISTANT_PORT = DEFAULT_HOME_ASSISTANT_PORT,
    HOME_ASSISTANT_TOKEN = DEFAULT_HOME_ASSISTANT_TOKEN,
} = process.env;