// TODO: Switch to winston, use ENV_VAR to set log level we want to see

let PROGRESS_INDEX = 0;

/**
 * Log a message to the console with proper formatting
 * @param {string} category - The category of the log
 * @param {string} severity - The severity level of the log
 * @param {...string} messages - The messages to be logged
 */
export async function log(
  category: string,
  severity: string,
  ...messages: string[]
) {
  if (severity === "debug") {
    return null;
  }
  const emojiForCategory = {
    openai: "🧠",
    ha: "🏠",
    google: "🔍",
    app: "🤖",
    prompt: "🗣️",
    response: "📢",
    server: "🌐",
  };
  const emoji = emojiForCategory[category] || "";
  return console.log(emoji, `[${category.toUpperCase()}]`, ...messages);
}

/**
 * Logs progress bar message
 * @param {string} action - The action being performed
 * @param {string} [message] - Overwrite the default message entirely
 */
export function logLoading(action = "Loading", message?: string) {
  const defaultMessage = `${action}${".".repeat((PROGRESS_INDEX % 3) + 1)}`;
  PROGRESS_INDEX = (PROGRESS_INDEX + 1) % 3;
  const messageToDisplay = message || defaultMessage;
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(messageToDisplay);
}
