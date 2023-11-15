import prompt from "prompt";
import { openai } from "./client";
import { log, logLoading } from "../_helpers/logs";
import { sleep } from "../_helpers/sleep";
import {
  OPENAI_ASSISTANT_CALENDAR_ASSISTANT_ID,
  OPENAI_USER_FIRSTNAME,
} from "../config";

import { createEvent, deleteEvent, getEvents } from "../google/calendar";

// =====================================================================================================================
// Assistant Config
// =====================================================================================================================
export const instructionsByAssistantName = {
  agenda:
    `Today is ` +
    new Date().toLocaleDateString() +
    ` at ` +
    new Date().toLocaleTimeString() +
    `. Assist ${OPENAI_USER_FIRSTNAME} with their calendar.`,
};

// TODO: Create assistant by code instead of using the UI
export const idByAssistantName = {
  agenda: OPENAI_ASSISTANT_CALENDAR_ASSISTANT_ID,
};

export const functionsForAssistant = {
  createEvent,
  getEvents,
  deleteEvent,
};

// =====================================================================================================================
// Helpers Functions
// =====================================================================================================================

/**
 * A function that wraps the tool function and returns a promise that resolves
 * to an openai compliant tool output object by injecting the tool ID.
 * @param {Function} func - The function to be wrapped.
 * @param {string} toolId - The ID of the tool.
 * @returns {Function} A function that takes any number of arguments, calls the wrapped function with these arguments, and returns a promise that resolves with the result of the function call.
 */
export const toolFunctionWrapper =
  (func, toolId) =>
  (...args) => {
    return func(...args).then((result) => {
      return {
        tool_call_id: toolId,
        output: JSON.stringify(result),
      };
    });
  };

export async function createAssistantThread(assitantName: string) {
  if (!openai) throw new Error("OpenAI client not initialized.");
  if (!assitantName) throw new Error("Assistant name is required.");
  if (!idByAssistantName[assitantName])
    throw new Error(`Assistant ${assitantName} not found.`);
  const assistantId = idByAssistantName[assitantName];
  const instructions = instructionsByAssistantName[assitantName]
    ? instructionsByAssistantName[assitantName]
    : "";

  // Thread Creation
  // ===================================================================================================================
  log(
    "openai",
    "info",
    `Starting conversation with assistant ${assitantName} (${assistantId})`,
  );
  const thread = await openai.beta.threads.create();
  log("openai", "debug", `Created thread ${thread.id}`);
  return { threadId: thread.id, assistantId, instructions };
}

export async function handleUserMessageOnThread(
  assistantId,
  threadId,
  message,
  instructions,
) {
  // Ask for User Message
  // =================================================================================================================
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  // Run the Assistant
  // =================================================================================================================
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions,
  });

  // Wait for Run Completion
  // =================================================================================================================
  let hasCompleted = false;
  while (!hasCompleted) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    const { status } = runStatus;

    // Requires Action
    // ===============================================================================================================
    if (status === "requires_action") {
      const requiredActions = runStatus.required_action;

      // Actions is of type "submit_tool_outputs"
      // =============================================================================================================
      // The Assistant want us to run some code
      if (
        requiredActions.type === "submit_tool_outputs" &&
        requiredActions.submit_tool_outputs
      ) {
        // Each Tool Call
        // ===========================================================================================================
        const toolPromises = requiredActions.submit_tool_outputs.tool_calls.map(
          (tool_call) => {
            const toolFunction = functionsForAssistant[tool_call.function.name];
            if (!toolFunction)
              throw new Error(`Function ${tool_call.function.name} not found.`);
            const functionOptions = JSON.parse(tool_call.function.arguments);
            return toolFunctionWrapper(
              toolFunction,
              tool_call.id,
            )(functionOptions);
          },
        );
        const toolOuputs = await Promise.all(toolPromises);
        log(
          "openai",
          "debug",
          `${toolOuputs.length} functions tools ran and will be submitted.`,
        );

        // Submit Tool Call Results
        run = await openai.beta.threads.runs.submitToolOutputs(
          threadId,
          run.id,
          {
            tool_outputs: toolOuputs,
          },
        );
      }
      hasCompleted = false;
      // Run Completed
      // =============================================================================================================
    } else if (status === "completed") {
      console.log("completed");
      hasCompleted = true;
    } else {
      // Waiting for Completion
      // =============================================================================================================
      logLoading(status);
      await sleep(2000);
    }
  }

  // Thread Completed
  // =================================================================================================================
  const threadMessages = await openai.beta.threads.messages.list(threadId);

  // Log the last message of the chat
  const response = threadMessages.data[0];
  if (response.content[0].text.value) {
    console.log(response.content[0].text.value);
    return response.content[0].text.value;
  } else {
    console.log(response);
  }
}

/**
 * Launches a conversation with the specified assistant.
 * Will never resolve and keep the conversation going forever.
 *
 * @param {string} assitantName - The name of the assistant to converse with.
 * @throws {Error} If the OpenAI client is not initialized.
 * @throws {Error} If the assistant name is not provided.
 * @throws {Error} If the assistant is not found.
 
 */
export async function launchAssistantConversation(assitantName: string) {
  const { threadId, assistantId, instructions } =
    await createAssistantThread(assitantName);

  // Message Loop
  // ===================================================================================================================
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Ask for User Message
    // =================================================================================================================
    prompt.start();
    const { message } = await prompt.get(["message"]);

    // Handle User Message
    // =================================================================================================================
    await handleUserMessageOnThread(
      assistantId,
      threadId,
      message,
      instructions,
    );
  }
}
