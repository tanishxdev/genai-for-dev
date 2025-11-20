// -------------------------------------------------------------
// GOAL: Add observability to Gemini calls
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import { logStart, logEnd, logInfo, logError } from "../utils/logger.js";

async function main() {
  logStart("Describe Model");

  const prompt = "Explain Generative AI in one line.";

  try {
    const t0 = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const t1 = Date.now();

    logInfo("Prompt", prompt);
    logInfo("Raw Response", response.text);
    logInfo("Latency (ms)", t1 - t0);
    logInfo("Model Version", response.modelVersion);
    logInfo("Usage Metadata", response.usageMetadata);
  } catch (err) {
    logError("Model call failed", err);
  }

  logEnd("Describe Model");
}

await main();
