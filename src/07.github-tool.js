// -------------------------------------------------------------
// GOAL: Tool Calling Example — Fetch GitHub Profile Info
// -------------------------------------------------------------
// Concepts:
// - Gemini decides when to call a tool
// - Tool fetches real data from GitHub’s public API
// - Response combined into natural explanation
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import readlineSync from "readline-sync";

const username = readlineSync.question("Enter GitHub username: ");

// 1️⃣ Define the tool logic (GitHub API fetch)
async function getGithubProfile({ username }) {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub profile for ${username}`);
  }
  const data = await res.json();

  // Return only relevant fields
  return {
    username: data.login,
    name: data.name,
    bio: data.bio,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    location: data.location,
    created_at: data.created_at,
    profile_url: data.html_url,
  };
}

// 2️⃣ Define tool metadata and schema
const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile information for a given username.",
    parameters: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "GitHub username (e.g., 'torvalds', 'vercel', 'tanish030')",
        },
      },
      required: ["username"],
    },
    function: getGithubProfile,
  },
];

// 3️⃣ Prompt for Gemini
const prompt = `Fetch and summarize GitHub profile info for user "${username}".`;


// 4️⃣ Main logic
async function main() {
  console.log("Starting GitHub Tool Example...\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    tools: tools,
  });

  console.log("Gemini Response:\n");
  console.log(response.text);
}

await main();

// -------------------------------------------------------------
// END — Tool Calling Example
// ------------------------------------------------------------