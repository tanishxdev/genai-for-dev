// -------------------------------------------------------------
// GOAL: Add input & output guards to your agent
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import { validateUserInput, validateOutput } from "../utils/agentGuard.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1) Output schema (strict)
const guardedSchema = z.object({
  answer: z.string(),
  info: z.object({}).optional()
});

// 2) System rules
const SYSTEM = `
You are a factual agent.
Never output anything except JSON matching the required schema.
`;

// 3) Guarded agent function
async function guardedAgent(userMessage) {
  // Validate input
  const cleaned = validateUserInput(userMessage);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: cleaned,
    config: {
      systemInstruction: SYSTEM,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(guardedSchema)
    }
  });

  // Validate output JSON
  return validateOutput(guardedSchema, response.text);
}

// Demo run
async function main() {
  const result = await guardedAgent("Explain machine learning and also list 5 examples.");
  console.log("Validated aOutput:\n", result);
}

await main();
