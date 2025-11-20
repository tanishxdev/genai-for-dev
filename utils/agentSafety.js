// -------------------------------------------------------------
// agentSafety.js
// Combined input guard, output guard, logging, and safe wrapper
// -------------------------------------------------------------

import { logStart, logEnd, logInfo, logError } from "./logger.js";

// 1) Input Guard
export function validateUserInput(input) {
  if (typeof input !== "string") {
    throw new Error("User message must be a string.");
  }

  if (input.trim().length === 0) {
    throw new Error("Empty message not allowed.");
  }

  if (input.length > 800) {
    throw new Error("Message too long. Limit to 800 characters.");
  }

  // Basic protection against prompt injection
  const banned = ["ignore previous", "sudo", "rm -rf", "<script>"];
  for (let b of banned) {
    if (input.toLowerCase().includes(b)) {
      throw new Error("Unsafe or restricted content detected.");
    }
  }

  return input;
}

// 2) Output Guard using Zod schema
export function validateModelOutput(schema, rawText) {
  try {
    const json = JSON.parse(rawText);
    return schema.parse(json);
  } catch (err) {
    logError("Output validation failed", rawText);
    throw new Error("Model returned invalid JSON or schema mismatch.");
  }
}

// 3) Combined Safe Agent Turn Wrapper
export async function safeAgentTurn({
  chat,
  userMessage,
  schema,
  tools,
  config
}) {
  logStart("Agent Turn");

  // Step A: Validate input
  let cleanedInput;
  try {
    cleanedInput = validateUserInput(userMessage);
    logInfo("Validated User Input", cleanedInput);
  } catch (err) {
    logError("Input Validation Error", err.message);
    throw err;
  }

  // Step B: Call model
  let response;
  const start = Date.now();

  try {
    response = await chat.sendMessage({
      message: cleanedInput,
      tools,
      config
    });

    const end = Date.now();
    logInfo("Model Latency (ms)", end - start);
    logInfo("Raw Model Response", response.text);

  } catch (err) {
    logError("Model Call Failed", err);
    throw err;
  }

  // Step C: Validate output using schema
  let parsed;
  try {
    parsed = validateModelOutput(schema, response.text);
    logInfo("Validated Output", parsed);
  } catch (err) {
    logError("Output Validation Error", err.message);
    throw err;
  }

  logEnd("Agent Turn");
  return parsed;
}
