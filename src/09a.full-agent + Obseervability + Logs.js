// -------------------------------------------------------------
// 09.full-agent.js (with Observability + Logging)
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import readlineSync from "readline-sync";
import { logStart, logEnd, logInfo, logError } from "../utils/logger.js";

const username = readlineSync.question("Enter GitHub username: ");

// -------------------------------------------------------------
// 1) Tools: implementations
//    Now instrumented with logging + latency
// -------------------------------------------------------------

async function getGithubProfile({ username }) {
  logStart(`Tool: getGithubProfile (${username})`);
  const t0 = Date.now();

  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);

  const t1 = Date.now();
  logInfo("GitHub API Latency (ms)", t1 - t0);

  if (!res.ok) {
    const msg = `GitHub user '${username}' not found (status: ${res.status})`;
    logError("GitHub API Error", msg);
    throw new Error(msg);
  }

  const data = await res.json();
  logInfo("GitHub API Raw Response", data);

  logEnd(`Tool: getGithubProfile (${username})`);

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
  logStart(`Tool: calculate (${operation})`);
  const t0 = Date.now();

  const ops = ["add", "subtract", "multiply", "divide"];
  if (!ops.includes(operation)) {
    const msg = `Unsupported operation '${operation}'`;
    logError("Calculator Error", msg);
    throw new Error(msg);
  }

  let result;
  switch (operation) {
    case "add": result = a + b; break;
    case "subtract": result = a - b; break;
    case "multiply": result = a * b; break;
    case "divide":
      if (b === 0) throw new Error("Division by zero.");
      result = a / b;
  }

  const t1 = Date.now();
  logInfo("Calculator Latency (ms)", t1 - t0);
  logInfo("Calculator Result", result);

  logEnd(`Tool: calculate (${operation})`);
  return result;
}

// -------------------------------------------------------------
// 2) Tool registry
// -------------------------------------------------------------
const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile data.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string" }
      },
      required: ["username"]
    },
    function: getGithubProfile
  },
  {
    name: "calculate",
    description: "Performs arithmetic operations.",
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
// 3) Structured JSON Output Schema
// -------------------------------------------------------------
const agentResponseSchema = z.object({
  answer: z.string(),
  used_tools: z.array(z.string()).default([]),
  data: z.object({}).passthrough().optional(),
  notes: z.array(z.string()).optional()
});

// -------------------------------------------------------------
// 4) System Instruction
// -------------------------------------------------------------
const SYSTEM_INSTRUCTION = `
You are a precise developer assistant.
Rules:
- Always use the GitHub username "${username}".
- Never guess or invent.
- Always prefer tool calls for factual data.
- Final answer must be valid JSON according to the schema.
`;

// -------------------------------------------------------------
// 5) Chat session for memory
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
// 6) Run one agent turn (with logging)
// -------------------------------------------------------------
async function runAgentTurn(chat, userMessage) {
  logStart("Agent Turn");
  logInfo("User Message", userMessage);

  const t0 = Date.now();

  const response = await chat.sendMessage({
    message: userMessage,
    tools,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(agentResponseSchema)
    }
  });

  const t1 = Date.now();
  logInfo("Model Latency (ms)", t1 - t0);
  logInfo("Model Raw JSON", response.text);

  const parsed = agentResponseSchema.parse(JSON.parse(response.text));

  logInfo("Validated Output", parsed);
  logEnd("Agent Turn");

  return parsed;
}

// -------------------------------------------------------------
// 7) Demo run
// -------------------------------------------------------------
async function main() {
  const chat = createAgentChat();

  const r1 = await runAgentTurn(chat,
    "How many followers does the GitHub user 'tanishkumardev' have? Also share the profile link."
  );
  console.log("\n=== Agent Turn A ===");
  console.dir(r1, { depth: 5 });

  const r2 = await runAgentTurn(chat,
    "Compute 23 multiplied by 76. Keep it short."
  );
  console.log("\n=== Agent Turn B ===");
  console.dir(r2, { depth: 5 });

  const r3 = await runAgentTurn(chat,
    "Give me a one-line summary of 'torvalds' GitHub profile and then add 42 + 58."
  );
  console.log("\n=== Agent Turn C ===");
  console.dir(r3, { depth: 5 });
}

await main();
