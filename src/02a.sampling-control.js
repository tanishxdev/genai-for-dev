// Demonstrate how topP and topK affect variation.

import ai from "../utils/geminiClient.js";

const prompt = "Give one creative slogan for a coffee brand.";

async function run() {
  console.log("\n--- Using topP: 0.3 (very focused) ---");
  let res1 = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { temperature: 0.7, topP: 0.3 }
  });
  console.log(res1.text);

  console.log("\n--- Using topK: 100 (wider choices) ---");
  let res2 = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { temperature: 0.7, topK: 100 }
  });
  console.log(res2.text);
}

await run();