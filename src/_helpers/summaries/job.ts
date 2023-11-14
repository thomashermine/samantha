import "dotenv/config";
import { log } from "../logs";
import { updateDeviceSummary } from "./devices";

import {
  HOME_ASSISTANT_SUMMARIES_DEVICE_ENTITY_PREFIX,
  HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES,
} from "../../config";

/**
 * Generate summaries for all devices we monitor, after getting their states from Home Assistant.
 * @param {Object} ha - The home assistant object.
 * @param {Object} openai - The openai object.
 * @returns {Promise<void>}
 */
export async function summariesJob(ha, openai) {
  const states = await ha.states.list();
  // Device Summaries
  // ===================================================================================================================
  log(
    "ha",
    "info",
    `Updating summary for ${HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES.length} devices...`,
  );
  await Promise.all(
    HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES.map((device) =>
      updateDeviceSummary(openai, ha, states, device),
    ),
  );
  log(
    "ha",
    "info",
    `Summary updated for ${HOME_ASSISTANT_SUMMARIES_DEVICES_ENTITIES.length} devices.`,
  );

  // Device Summaries, Summary
  // ===================================================================================================================
  const deviceSummaries = states.filter((state) =>
    state.entity_id.startsWith(
      "sensor." + HOME_ASSISTANT_SUMMARIES_DEVICE_ENTITY_PREFIX,
    ),
  );
  const deviceSummariesStates = deviceSummaries.map(
    (state) => state.attributes.content,
  );
  log("ha", "info", `Updated summary for ${deviceSummaries.length} devices.`);
  log("ha", "info", "All Summaries", deviceSummariesStates.join("\n"));
}
