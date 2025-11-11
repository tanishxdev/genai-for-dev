// -------------------------------------------------------------
// GOAL: Demonstrate multi-turn chat with Gemini SDK
// -------------------------------------------------------------
// Concepts:
// - Create a chat session with history
// - Send multiple messages
// - Maintain context between turns
// - Stream the final message
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";

async function main() {
  console.log("Starting multi-turn chat...\n");

  // 1️⃣ Create a new chat session
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Hi! I'm Gemini, your AI assistant. How can I help you today?" }],
      },
    ],
  });

  // 2️⃣ First message
  const response1 = await chat.sendMessage({
    message: "I have 2 dogs at home.",
  });
  console.log("User: I have 2 dogs at home.");
  console.log("Gemini:", response1.text, "\n");

  // 3️⃣ Second message – model should remember previous info
  const response2 = await chat.sendMessage({
    message: "How many paws are there in my house?",
  });
  console.log("User: How many paws are there in my house?");
  console.log("Gemini:", response2.text, "\n");

  // 4️⃣ Third message – continues with context
  const response3 = await chat.sendMessage({
    message: "What are some fun activities for them?",
  });
  console.log("User: What are some fun activities for them?");
  console.log("Gemini:", response3.text, "\n");

  // 5️⃣ Streaming message – live output
  console.log("User: Tell me about AI trends in 2025.");
  console.log("Gemini (streaming):\n");

  const stream = await chat.sendMessageStream({
    message: "Tell me about AI trends in 2025.",
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) process.stdout.write(text);
  }

  console.log("\n\nStream complete.\n");
}

// Run the chat
await main();
