/* 
   Topic: Basic TypeScript
   Purpose: Learn types essential for GenAI engineering.
*/

// ----------------------------------------------
// 1. Basic types
// ----------------------------------------------
let username: string = "Tanish";
let age: number = 21;
let active: boolean = true;


// ----------------------------------------------
// 2. Arrays
// ----------------------------------------------
let skills: string[] = ["JS", "Node", "GenAI"];


// ----------------------------------------------
// 3. Object typing
// ----------------------------------------------
let useruser: { name: string; age: number } = {
  name: "Tanish",
  age: 21
};


// ----------------------------------------------
// 4. Interface
// ----------------------------------------------
interface AgentInput {
  prompt: string;
  history?: string[];   // optional
}

const input: AgentInput = {
  prompt: "Summarize the text."
};


// ----------------------------------------------
// 5. Type Alias
// ----------------------------------------------
type GenAIResponse = {
  success: boolean;
  output: string;
};

const res: GenAIResponse = {
  success: true,
  output: "Summary..."
};


// ----------------------------------------------
// 6. Function typing
// ----------------------------------------------
function add(a: number, b: number): number {
  return a + b;
}


// ----------------------------------------------
// 7. Async function typing
// ----------------------------------------------
async function getSummary(): Promise<string> {
  return "AI summary output";
}