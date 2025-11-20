// -------------------------------------------------------------
// agentGuard.js
// A reusable safety + validation layer for Gemini outputs
// -------------------------------------------------------------
import { z } from "zod";

// Basic utility guard for user input
export function validateUserInput(input) {
  if (typeof input !== "string") throw new Error("Input must be a string.");

  if (input.length > 500) {
    throw new Error("Input too long. Limit to 500 characters.");
  }

  if (input.includes("<script>") || input.includes("rm -rf")) {
    throw new Error("Unsafe input detected.");
  }

  return input;
}

// Generic output guard
export function validateOutput(schema, responseText) {
  try {
    const json = JSON.parse(responseText);
    return schema.parse(json);
  } catch (e) {
    console.error("Output validation failed:", e.message);
    throw new Error("Model returned invalid or unsafe JSON.");
  }
}
