
/**
 * Log a message to the console with proper formatting
 */

export async function log(category, severity, ...messages) {
    const emojiForCategory = {
        'openai': '🧠',
        'ha': '🏠',
        'app': '🤖',
    }
    return console.log(emojiForCategory[category], `[${category.toUpperCase()}]`, ...messages);
}