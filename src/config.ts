export const {
    NODE_ENV = 'development',
} = process.env;

// Default values depending on the environment
const DEFAULT_HOME_ASSISTANT_HOST = (NODE_ENV === 'production') ? 'http://supervisor/core' : 'http://homeassistant.local';
const DEFAULT_HOME_ASSISTANT_PORT = (NODE_ENV === 'production') ? 80 : 8123;
const DEFAULT_HOME_ASSISTANT_TOKEN = process.env.SUPERVISOR_TOKEN;
const DEFAULT_UPDATE_INTERVAL = (NODE_ENV === 'production') ? 1000*60*60 : 10000; // Every hour in production, every 5 seconds in dev

// =====================================================================================================================
// Config
// =====================================================================================================================
// Config — Directly from ENV or reasonable defaults for the environment

export const {
    OPENAI_TOKEN, 
    OPENAI_MODEL = 'gpt-3.5-turbo',
    
    HOME_ASSISTANT_HOST = DEFAULT_HOME_ASSISTANT_HOST,
    HOME_ASSISTANT_PORT = DEFAULT_HOME_ASSISTANT_PORT,
    HOME_ASSISTANT_TOKEN = DEFAULT_HOME_ASSISTANT_TOKEN,


    UPDATE_INTERVAL = DEFAULT_UPDATE_INTERVAL,
    LANGUAGE = 'french'

} = process.env;

export const SUMMARY_DEVICE_ENTITY_PREFIX = 'summary_device_'; // will be followed by the device name
export const SUMMARY_DEVICES_ENTITIES = ['hall_tablet','iphone_thomas','iphone_caroline','macbookpro_thomas','roborock','octoprint','litterbox','toothbrush','pet_feeder','pet_fountain'];
//export const SUMMARY_DEVICES_ENTITIES = ['roborock'];