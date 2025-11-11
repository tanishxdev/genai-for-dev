// -------------------------------------------------------------
// GOAL: Demonstrate Function (Tool) Calling with Gemini SDK
// -------------------------------------------------------------
// Concepts:
// - Define tool functions
// - Register tools in config
// - Let model call tools automatically
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";

// 1️⃣ Define a simple tool (function) with schema and logic
async function getWeather({ location }) {
  // Simulated real-time weather data
  const data = {
    Delhi: "Sunny, 30°C",
    Mumbai: "Cloudy, 28°C",
    Bangalore: "Rainy, 25°C",
  };
  return data[location] || "Weather data not available";
}

// 2️⃣ Define tool metadata (schema + description)
const tools = [
  {
    name: "getWeather",
    description: "Fetches current weather for a given Indian city.",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    },
    // Link the function
    function: getWeather,
  },
];

// 3️⃣ Create prompt
const prompt = "What is the weather like in Delhi right now?";

// 4️⃣ Call Gemini with tool config
async function main() {
  console.log("Starting tool-calling example...\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    tools: tools,
    
    // ✅ Use config only for generation settings
    config: {
      temperature: 0.1,
      maxOutputTokens: 1000,
    }
  });

  console.log("Response:\n");
  console.log(response.text);
}

await main();
