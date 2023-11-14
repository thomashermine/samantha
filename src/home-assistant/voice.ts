import { HOME_ASSISTANT_MEDIA_PLAYER, LOCALE } from "../config";
import { ha } from "./client";

/**
 * This function uses the Home Assistant service to make a TTS call.
 * @param {Object} ha - The Home Assistant instance.
 * @param {string} content - The message to be spoken.
 * @returns {Promise<void>} - The Promise that resolves when the TTS call has been made.
 */
export async function say(content: string): Promise<void> {
  if (!ha) throw new Error("Home Assistant client not initialized");
  return await ha.services.call("cloud_say", "tts", {
    entity_id: HOME_ASSISTANT_MEDIA_PLAYER,
    message: content,
    language: LOCALE,
    options: {
      voice: "JosephineNeural",
    },
  });
}
