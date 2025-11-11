// -------------------------------------------------------------
// 09.full-agent.js
// A minimal production-style agent with:
// - Multi-turn chat memory
// - Tool calling (GitHub profile + Calculator)
// - Structured JSON outputs enforced via Zod schema
// - Guardrails in system instruction to avoid guessing
//
// Assumptions:
// - You already have /utils/geminiClient.js loading GEMINI_API_KEY from project root .env
// - Run: node src/09.full-agent.js
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import readlineSync from "readline-sync";

const username = readlineSync.question("Enter GitHub username: ");

// ------------------------------
// 1) Tools: implementations
// ------------------------------

/**
 * getGithubProfile: Fetch basic public profile information.
 * - No token required, uses public GitHub API.
 * - Only returns raw factual fields. No interpretation here.
 */
async function getGithubProfile({ username }) {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Surface a clear error for the model to handle gracefully
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

/**
 * calculate: Deterministic arithmetic to avoid LLM math slips.
 * Supports add, subtract, multiply, divide with number inputs.
 */
async function calculate({ a, b, operation }) {
  const ops = ["add", "subtract", "multiply", "divide"];
  if (!ops.includes(operation)) {
    throw new Error(`Unsupported operation '${operation}'. Use one of: ${ops.join(", ")}`);
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

// ------------------------------
// 2) Tool registry (metadata)
// The SDK needs name, description, parameters, and function binding.
// ------------------------------
const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile data for a username.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string", description: "GitHub username, e.g., 'torvalds'" }
      },
      required: ["username"]
    },
    function: getGithubProfile
  },
  {
    name: "calculate",
    description: "Performs basic arithmetic on two numbers.",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number", description: "First operand" },
        b: { type: "number", description: "Second operand" },
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "Arithmetic operation to perform"
        }
      },
      required: ["a", "b", "operation"]
    },
    function: calculate
  }
];

// ------------------------------
// 3) Structured agent response contract (Zod)
// This is what your app will consume.
// ------------------------------
const agentResponseSchema = z.object({
  // A short final answer for humans
  answer: z.string(),

  // List of tool names that were actually used
  used_tools: z.array(z.string()).default([]),

  // Optional machine-usable data. Flexible by design.
  data: z.object({}).passthrough().optional(),

  // Optional notes for transparency or citations
  notes: z.array(z.string()).optional()
});

// ------------------------------
// 4) System instruction
// Guide behavior: be precise, avoid guessing, prefer tools over assumptions,
// and always return JSON matching the schema.
// ------------------------------
const SYSTEM_INSTRUCTION = `
You are a precise developer assistant and agent orchestrator.
Rules:
- Always use this "${username}"GitHub username .
- Never guess.
- Never make assumptions.
- Never hallucinate.
- Never invent.
- Prefer calling tools instead of guessing facts.
- Never invent numbers. If a tool returns data, use it verbatim.
- If a lookup fails, state that it failed and continue with what is possible.
- Final output must be valid JSON and match the provided schema exactly.
- Keep "answer" concise and clear for humans.
- Place any raw factual payloads under "data".
- Fill "used_tools" with the exact tool names used.
`;

// ------------------------------
// 5) Create a chat session (memory)
// We seed a small greeting context. The session maintains history.
// ------------------------------
function createAgentChat() {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      { role: "user", parts: [{ text: "You are my coding agent." }] },
      { role: "model", parts: [{ text: "Understood. I will help with tools and precise answers." }] }
    ]
  });
}

// ------------------------------
// 6) One-shot agent turn
// Provide any user task; agent decides to use tools or answer directly.
// Response is guaranteed JSON parsed and validated by zod.
// ------------------------------
async function runAgentTurn(chat, userMessage) {
  const response = await chat.sendMessage({
    // Single string message; the chat object will include prior history automatically.
    message: userMessage,
    // Strong config to enforce structure and reduce creativity when facts matter.
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2,
      // Keep default thinking for better tool selection; set to 0 to disable if you want faster runs.
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(agentResponseSchema)
    },
    tools
  });

  // Validate and return
  const parsed = agentResponseSchema.parse(JSON.parse(response.text));
  return parsed;
}

// ------------------------------
// 7) Demo run
// You can change these queries to test different paths.
// ------------------------------
async function main() {
  const chat = createAgentChat();

  // Example A: GitHub profile question
  const q1 = "How many followers does the GitHub user 'tanishkumardev' have? Also share the profile link.";
  const r1 = await runAgentTurn(chat, q1);
  console.log("\n=== Agent Turn A ===");
  console.log(JSON.stringify(r1, null, 2));

  // Example B: Calculator usage
  const q2 = "Compute 23 multiplied by 76. Keep it short.";
  const r2 = await runAgentTurn(chat, q2);
  console.log("\n=== Agent Turn B ===");
  console.log(JSON.stringify(r2, null, 2));

  // Example C: Combined query
  const q3 = "Give me a one-line summary of 'torvalds' GitHub profile and then add 42 + 58.";
  const r3 = await runAgentTurn(chat, q3);
  console.log("\n=== Agent Turn C ===");
  console.log(JSON.stringify(r3, null, 2));
}

await main();
