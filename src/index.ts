import "dotenv/config";

import { log } from "./_helpers/logs";
import { sleep } from "./_helpers/sleep";
import { init } from "./init";
import { summariesJob } from "./_helpers/summaries/job";
import { HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL } from "./config";

import { launchAssistantConversation } from "./openai/assistant";

async function main() {
  // Init
  // ===================================================================================================================
  log("app", "info", "Starting up...");
  const { ha, openai } = await init();
  log("app", "info", "Initialized.");

  // Start the OpenAI Assistant Conversation
  // ===================================================================================================================
  await launchAssistantConversation("agenda");

  // Jobs
  // ===================================================================================================================
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // TODO: Use a pub-sub model instead to update everytime one of the entities we summarize is updated
    await summariesJob(ha, openai);
    await sleep(HOME_ASSISTANT_SUMMARIES_UPDATE_INTERVAL);
  }
}

main();
