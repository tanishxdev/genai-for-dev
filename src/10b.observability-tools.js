// -------------------------------------------------------------
// GOAL: Trace tool calls with detailed logs
// -------------------------------------------------------------

import ai from "../utils/geminiClient.js";
import fetch from "node-fetch";
import { logStart, logEnd, logInfo, logError } from "../utils/logger.js";

// Tool implementation with added logging
async function getGithubProfile({ username }) {
  logStart(`Tool: getGithubProfile (${username})`);
  const t0 = Date.now();

  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();

  const t1 = Date.now();
  logInfo("GitHub API Latency (ms)", t1 - t0);
  logInfo("GitHub API Raw Data", data);

  logEnd(`Tool: getGithubProfile (${username})`);
  return data;
}

const tools = [
  {
    name: "getGithubProfile",
    description: "Fetch GitHub profile info.",
    parameters: {
      type: "object",
      properties: { username: { type: "string" } },
      required: ["username"],
    },
    function: getGithubProfile,
  }
];

async function main() {
  logStart("Tool Observability");

  const prompt = "Fetch the GitHub profile for 'torvalds'.";

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      tools,
    });

    logInfo("Final Model Response", res.text);
  } catch (err) {
    logError("Tool-call failure", err);
  }

  logEnd("Tool Observability");
}

await main();
