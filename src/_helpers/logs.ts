
// TODO: Switch to winston, use ENV_VAR to set log level we want to see

/**
 * Log a message to the console with proper formatting
 */
export async function log(category, severity, ...messages) {

    //if(severity === 'debug') { return null; }
    const emojiForCategory = {
        'openai': '🧠',
        'ha': '🏠',
        'app': '🤖',
        'prompt': '🗣️',
        'response': '📢',
    }
    const emoji = emojiForCategory[category] || '';
    return console.log(emoji, `[${category.toUpperCase()}]`, ...messages);
}