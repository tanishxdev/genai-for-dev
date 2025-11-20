// -------------------------------------------------------------
// Full agent with:
// - Multi-turn chat memory
// - Tool calling (GitHub + Calculator)
// - Structured outputs enforced by Zod
// - Integrated Safety Layer (input guard, output guard, logging)
// - Reusable safeAgentTurn wrapper
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import readlineSync from "readline-sync";

// Import the reusable safety wrapper
import { safeAgentTurn } from "../utils/agentSafety.js";

const username = readlineSync.question("Enter GitHub username: ");

// -------------------------------------------------------------
// 1) Tools: Implementations (unchanged, pure logic)
// -------------------------------------------------------------

async function getGithubProfile({ username }) {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GitHub user '${username}' not found or API error ${res.status}`);
  }
  const data = await res.json();
  return {
    username: data.login ?? null,
    name: data.name ?? null,
    bio: data.bio ?? null,
    followers: data.followers ?? null,
    following: data.following ?? null,
    public_repos: data.public_repos ?? null,
    location: data.location ?? null,
    html_url: data.html_url ?? null,
    created_at: data.created_at ?? null,
    company: data.company ?? null,
    blog: data.blog ?? null
  };
}

async function calculate({ a, b, operation }) {
  const ops = ["add", "subtract", "multiply", "divide"];
  if (!ops.includes(operation)) {
    throw new Error(`Unsupported operation '${operation}'`);
  }
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Parameters 'a' and 'b' must be numbers.");
  }
  switch (operation) {
    case "add": return a + b;
    case "subtract": return a - b;
    case "multiply": return a * b;
    case "divide":
      if (b === 0) throw new Error("Division by zero.");
      return a / b;
  }
}

// -------------------------------------------------------------
// 2) Tool registry (metadata for the model)
// -------------------------------------------------------------

const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile data for a username.",
    parameters: {
      type: "object",
      properties: { username: { type: "string" } },
      required: ["username"]
    },
    function: getGithubProfile
  },
  {
    name: "calculate",
    description: "Performs arithmetic calculations.",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"] }
      },
      required: ["a", "b", "operation"]
    },
    function: calculate
  }
];

// -------------------------------------------------------------
// 3) Structured agent response schema
// -------------------------------------------------------------

const agentResponseSchema = z.object({
  answer: z.string(),
  used_tools: z.array(z.string()).default([]),
  data: z.object({}).passthrough().optional(),
  notes: z.array(z.string()).optional()
});

// -------------------------------------------------------------
// 4) System instruction (rules for agent behavior)
// -------------------------------------------------------------

const SYSTEM_INSTRUCTION = `
You are a precise developer assistant.
Rules:
- Always use this GitHub username: "${username}".
- Never guess or invent.
- Never hallucinate.
- Always prefer tool calls for factual data.
- Always return valid JSON matching the schema.
- Keep answer concise.
- Place raw data inside the 'data' field.
`;

// -------------------------------------------------------------
// 5) Create a chat session (memory)
// -------------------------------------------------------------

function createAgentChat() {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      { role: "user", parts: [{ text: "You are my coding agent." }] },
      { role: "model", parts: [{ text: "Understood. I will use tools when needed." }] }
    ]
  });
}

// -------------------------------------------------------------
// 6) Use safeAgentTurn instead of manual logic
// -------------------------------------------------------------

async function runAgentTurn(chat, userMessage) {
  return safeAgentTurn({
    chat,
    userMessage,
    schema: agentResponseSchema,
    tools,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(agentResponseSchema)
    }
  });
}

// -------------------------------------------------------------
// 7) Demo run
// -------------------------------------------------------------

async function main() {
  const chat = createAgentChat();

  const q1 = "How many followers does the GitHub user 'tanishkumardev' have? Also share the profile link.";
  const r1 = await runAgentTurn(chat, q1);
  console.log("\n=== Agent Turn A ===");
  console.dir(r1, { depth: 5 });

  const q2 = "Compute 23 multiplied by 76. Keep it short.";
  const r2 = await runAgentTurn(chat, q2);
  console.log("\n=== Agent Turn B ===");
  console.dir(r2, { depth: 5 });

  const q3 = "Give me a one-line summary of 'torvalds' profile and also add 42 + 58.";
  const r3 = await runAgentTurn(chat, q3);
  console.log("\n=== Agent Turn C ===");
  console.dir(r3, { depth: 5 });
}

await main();

// | Feature                                       | Implemented? | Where               |
// | --------------------------------------------- | ------------ | ------------------- |
// | Input Guard                                   | Yes          | agentSafety.js      |
// | Output Guard (Zod)                            | Yes          | agentSafety.js      |
// | Logging (latency, raw JSON, validated output) | Yes          | agentSafety.js      |
// | Structured Output                             | Yes          | Zod schema          |
// | Tool Calling                                  | Yes          | GitHub + Calculator |
// | Clean Agent Turn wrapper                      | Yes          | safeAgentTurn       |
// | Multi-turn memory                             | Yes          | chat session        |
