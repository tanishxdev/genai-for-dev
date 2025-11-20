// -------------------------------------------------------------
// GOAL: Demonstrate multi-turn conversation using Gemini SDK
// -------------------------------------------------------------
// Concepts Covered:
// 1. Creating a chat session with initial history
// 2. Sending multiple messages to the same chat instance
// 3. Understanding how Gemini maintains conversational context
// -------------------------------------------------------------

import { config } from "dotenv";
import ai from "../utils/geminiClient.js";

async function main() {
  console.log("\n=== Multi-Turn Chat Demo (Gemini SDK) ===\n");

  // -------------------------------------------------------------
  // 1️⃣ Create chat session with initial conversation history
  // -------------------------------------------------------------
  // Why?
  // - History define karta hai ki conversation pehle kya hua.
  // - Gemini is puri history ko context ki tarah use karta hai.
  // -------------------------------------------------------------
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",

    // Initial conversation history (context setup)
    history: [
      {
        role: "user",
        parts: [{ text: "Hi, who are you?" }],
      },
      {
        role: "model",
        parts: [{ text: "I'm Gemini, your AI assistant. How can I help you today?" }],
      },
    ],
  });

  // -------------------------------------------------------------
  // 2️⃣ User Message #1 — New information given to model
  // -------------------------------------------------------------
  // Model should remember:
  // - User has 2 dogs
  // -------------------------------------------------------------
  const response1 = await chat.sendMessage({
    message: "I have 2 dogs at home.",
  });

  console.log("User: I have 2 dogs at home.");
  console.log("Gemini:", response1.text, "\n");

  // -------------------------------------------------------------
  // 3️⃣ User Message #2 — Model should use memory ("2 dogs")
  // -------------------------------------------------------------
  const response2 = await chat.sendMessage({
    message: "Suggest some nicknames for them.",
  });

  console.log("User: Suggest some nicknames for them.");
  console.log("Gemini:", response2.text, "\n");

  // -------------------------------------------------------------
  // 4️⃣ User Message #3 — Continuing context (daily activities)
  // -------------------------------------------------------------
  const response3 = await chat.sendMessage({
    message: "What activities should I do with them daily?",
  });

  console.log("User: What activities should I do with them daily?");
  console.log("Gemini:", response3.text, "\n");

  // -------------------------------------------------------------
  // 5️⃣ User Message #4 — Model should still remember "dogs"
  // -------------------------------------------------------------
  const response4 = await chat.sendMessage({
    message: "Can they learn basic tricks easily?",
  });

  console.log("User: Can they learn basic tricks easily?");
  console.log("Gemini:", response4.text, "\n");
}

await main();
