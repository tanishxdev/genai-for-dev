// GOAL: Use reusable Gemini client setup

// Import the pre-configured Gemini client instance
import ai from "../../../utils/geminiClient.js";

// Async main function to handle API call
async function main() {
  // Send text input to Gemini model and await generated response
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is OpenAI, in short in short?",
  });

  // Print the text output from the response
  console.log("Response:", response.text);
}

// Run the function
await main();
