import ai from "../utils/geminiClient.js";

async function main() {
  const prompt = "Write one line describing AI for high school students.";
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      candidateCount: 3, // Ask for 3 variations
      temperature: 0.8, // close to 1 → more creative and close to 0 → more factual
    },
  });

  console.log("Received", res.candidates.length, "candidates:\n");
  res.candidates.forEach((c, i) => {
    console.log(`Option ${i + 1}:`, c.content.parts[0].text);
  });
}
await main();
