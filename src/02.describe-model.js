// -------------------------------------------------------------
// GOAL: Understand Gemini model parameters and configuration
// -------------------------------------------------------------
// This script demonstrates how to:
// - Control model behavior using config
// - Use system instructions
// - Adjust temperature (randomness)
// - Disable or enable "thinking"
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    // IMPORTANT: systemInstruction must be TOP-LEVEL, not inside config
    systemInstruction: "You are an expert AI tutor explaining clearly.",

    // USER INPUT
    contents: "Explain NodeJS.",

    // GENERATION BEHAVIOR
    config: {
      temperature: 0.1,          // lower randomness → more factual answers
      maxOutputTokens: 150,      // limit output length
      thinkingConfig: {
        thinkingBudget: 0        // disable thinking for faster response
      }
    }
  });

  console.log("Response:\n");
  console.log(response.text);
}

await main();
