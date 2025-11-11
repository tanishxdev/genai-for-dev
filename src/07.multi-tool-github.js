// -------------------------------------------------------------
// GOAL: Tool Calling Example — Fetch GitHub Profile & Repos Info
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import readlineSync from "readline-sync";

const username = readlineSync.question("Enter GitHub username: ");

// -------------------------------------------------------------
// Tool 1: Get basic GitHub profile info
// -------------------------------------------------------------
async function getGithubProfile({ username }) {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub profile for ${username}`);
  }
  const data = await res.json();
  return {
    username: data.login,
    name: data.name,
    bio: data.bio,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    location: data.location,
    profile_url: data.html_url,
  };
}

// -------------------------------------------------------------
// Tool 2: Get recent GitHub repositories info
// -------------------------------------------------------------
async function getGithubRepos({ username }) {
  const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=updated`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch repos for ${username}`);
  }
  const repos = await res.json();
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url,
  }));
}

// -------------------------------------------------------------
// Register both tools
// -------------------------------------------------------------
const tools = [
  {
    name: "getGithubProfile",
    description: "Fetches public GitHub profile information for a given username.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string", description: "GitHub username" },
      },
      required: ["username"],
    },
    function: getGithubProfile,
  },
  {
    name: "getGithubRepos",
    description: "Fetches recent GitHub repositories for a given username with stars and forks.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string", description: "GitHub username" },
      },
      required: ["username"],
    },
    function: getGithubRepos,
  },
];

// -------------------------------------------------------------
// Dynamic prompt
// -------------------------------------------------------------
const prompt = `
Fetch and summarize GitHub profile and top repos for user "${username}".
Mention name, followers, and briefly list a few recent repos with stars and language.
`;

// -------------------------------------------------------------
// Main execution
// -------------------------------------------------------------
async function main() {
  console.log("Starting GitHub Multi-Tool Example...\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    tools: tools,
    config: {
      temperature: 0.2,
      maxOutputTokens: 300,
    },
  });

  // ✅ handle both text and structured responses
  const textOutput =
    response.text ||
    response.output?.[0]?.content?.[0]?.text ||
    JSON.stringify(response.output, null, 2);

  console.log("Gemini Response:\n");
  console.log(textOutput);
}

await main();
