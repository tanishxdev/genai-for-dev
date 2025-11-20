// GOAL: Demonstrate Structured Output using Gemini SDK

import ai from "../utils/geminiClient.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Define the data structure you want
const infoSchema = z.object({
    person: z.string().describe("The name of the person mentioned"),
    company: z.string().describe("The company they are associated with"),
    founded_year: z.number().describe("The Year of the company was founded"),
    location: z.string().describe("Where the company was founded"),
});

// Write the natural language text to extract data from
const prompt = `Elon Musk founded SpaceX in 2002 in California.`;

// Ask Gemini for structured output following your schema
async function main() {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(infoSchema),
    },
    });
    // Try extracting text or JSON safely
    const raw =
    response.output?.[0]?.content?.[0]?.text ||
    response.output?.[0]?.content?.[0]?.json ||
    response.text ||
    "{}";

    // Convert text to JSON
    const jsonData = JSON.parse(raw);

    // Parse and validate the model’s JSON output
    const result = infoSchema.parse(jsonData);
    
    console.log("Respone - Structured Ouput:\n");
    console.log(result);
}

main();