import { LANGUAGE, OPENAI_MODEL } from "../config";
import { log } from "../_helpers/logs";

/**
 * Get the first chat response from OpenAI API
 * @param {Object} openai - OpenAI API instance
 * @param {string} prompt - Prompt to send to the API
 * @param {Object} paramOptions - Options for the prompt
 * @returns {Promise<Object>} - Promise that resolves to the chat completion object
 */
export async function getFirstChatResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openai: any,
  prompt: string,
  paramOptions?: object,
) {
  if (!openai) {
    throw new Error("OpenAI must be initialized");
  }
  if (!prompt) {
    throw new Error("Prompt must be a string");
  }
  const defaultOptions = {
    model: OPENAI_MODEL,
  };
  const options = {
    ...defaultOptions,
    ...paramOptions,
  };
  log("prompt", "debug", prompt);
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: `Respond in ${LANGUAGE}` },
    ],
    ...options,
  });
  if (chatCompletion.choices.length > 0 && chatCompletion.choices[0].message) {
    log("response", "debug", chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
  }
  log(prompt, "warn", "No response from OpenAI API for prompt", prompt);
  return null;
}
