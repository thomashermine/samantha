import "dotenv/config";
import { log } from "./_helpers/logs";
import { init } from "./init";

import {
  createAssistantThread,
  handleUserMessageOnThread,
} from "./openai/assistant";

async function main() {
  // Init
  // ===================================================================================================================
  log("app", "info", "Starting up...");
  const { server } = await init();
  log("app", "info", "Initialized.");

  // Start the OpenAI Assistant Conversation
  // ===================================================================================================================
  const { threadId, assistantId, instructions } =
    await createAssistantThread("agenda");

  server.post("/assistant/agenda/message", async (req, res) => {
    console.log("req.body", req.body);
    const { message } = req.body;
    log("app", "debug", `Received message ${message}`);
    const response = await handleUserMessageOnThread(
      assistantId,
      threadId,
      message,
      instructions,
    );
    res.status(201).json({ message: response });
  });
  log(
    "app",
    "info",
    "Ready to make conversation with assistant. Send a POST request to /assistant/agenda/message with a message in the body to start the conversation.",
  );
}

main();
