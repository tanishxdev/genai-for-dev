// -------------------------------------------------------------
// GOAL: Combine Tool Calling + Structured Output
// -------------------------------------------------------------
// Concepts:
// - Fetch live GitHub data via tool
// - Enforce structured JSON response (no hallucination)
// - Validate schema using Zod
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1️⃣ Define the GitHub API Tool
async function getGithubProfile({ username }) {
  const url = `https://api.github.com/users/${tanishkumardev}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub user ${username} not found.`);
  const data = await res.json();

  // Return only factual data, no interpretation
  return {
    username: data.login,
    name: data.name,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
    location: data.location,
    html_url: data.html_url,
    created_at: data.created_at,
  };
}

// 2️⃣ Define schema to enforce structured output
const profileSchema = z.object({
  username: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  public_repos: z.number(),
  location: z.string().nullable(),
  html_url: z.string(),
  created_at: z.string(),
});

// 3️⃣ Define tool metadata
const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile info.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string", description: "GitHub username" },
      },
      required: ["username"],
    },
    function: getGithubProfile,
  },
];

// 4️⃣ Prompt Gemini with JSON response enforcement
const prompt = `
Get the GitHub profile for user "tanishkumardev".
Return only verified fields from the API in structured JSON format.
Do not summarize or assume anything not in the fetched data.
`;

// 5️⃣ Execute and enforce structured response
async function main() {
  console.log("Starting GitHub Structured Tool Example...\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    tools: tools,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(profileSchema),
    },
  });

  // 6️⃣ Validate JSON structure
  const parsed = profileSchema.parse(JSON.parse(response.text));

  console.log("Structured GitHub Data (Verified):\n");
  console.log(parsed);
}

await main();
