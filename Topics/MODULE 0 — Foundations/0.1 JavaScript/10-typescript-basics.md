# MODULE 0 → 0.1 JavaScript Foundations

# Topic 10 — Basic TypeScript

TypeScript is extremely important in modern GenAI engineering because:

* Every serious GenAI SDK (LangChainJS, LangGraph, Google Gemini, MCP) uses TypeScript.
* Tool schemas rely on types.
* Agent state needs strict typing.
* RAG metadata and vector embeddings should have typed shapes.
* Avoids runtime errors in large modular AI codebases.

We will cover exactly what you need for GenAI work.
No unnecessary OOP complexity.
No TS decorators.
No React-specific features.

Only real backend + AI engineering concepts.

---

# 1. CONCEPT SUMMARY

This topic covers:

1. What is TypeScript
2. Basic types (string, number, boolean, array, object)
3. Type annotations
4. Interfaces
5. Type aliases
6. Optional properties
7. Union types
8. Function typing
9. async/await typing
10. Why TS makes GenAI systems safer

---

# 2. WHY TYPESCRIPT MATTERS IN GENAI ENGINEERING

Because real GenAI codebases involve:

* Thousands of lines of code
* Multiple modules (agents, tools, RAG, pipelines)
* Complex state passing
* JSON schemas
* Dynamic LLM responses

Without TypeScript:

* Wrong data shapes break tool calling
* Mistakes hide until runtime
* Agents fail silently
* JSON parsing bugs go unnoticed
* State corruption occurs in LangGraph workflows

Companies expect TypeScript knowledge for AI engineering roles (2025–2027).

---

# 3. THEORY (Simple + Clear)

---

## 3.1 What is TypeScript?

JavaScript with **types added**.

TypeScript catches errors **before running** the program.

Example:

```
let age: number = 21;
age = "twenty"; // ERROR
```

---

## 3.2 Basic Type Annotations

```
let name: string = "Tanish";
let age: number = 21;
let isActive: boolean = true;
```

---

## 3.3 Arrays

```
let scores: number[] = [10, 20, 30];
let skills: string[] = ["JS", "Node", "GenAI"];
```

---

## 3.4 Objects

```
let user: { name: string; age: number } = {
  name: "Tanish",
  age: 21
};
```

---

## 3.5 Interfaces (used heavily in agents)

```
interface User {
  name: string;
  age: number;
}

const u: User = { name: "Tanish", age: 21 };
```

---

## 3.6 Type Aliases

```
type Result = {
  success: boolean;
  output: string;
};
```

---

## 3.7 Optional Properties

```
interface Config {
  apiKey: string;
  model?: string;      // optional field
}
```

---

## 3.8 Union Types (useful for tool-calling outputs)

```
let status: "success" | "error";
status = "success";
```

---

## 3.9 Function Typing

```
function add(a: number, b: number): number {
  return a + b;
}
```

---

## 3.10 Async Function Typing

```
async function fetchData(): Promise<string> {
  return "Done";
}
```

---

# 4. CODE EXAMPLES

Create file:

```
GenAI/Topics/Module0/10-typescript-basics.ts
```

Add:

```ts
/* 
   Topic: Basic TypeScript
   Purpose: Learn types essential for GenAI engineering.
*/

// ----------------------------------------------
// 1. Basic types
// ----------------------------------------------
let name: string = "Tanish";
let age: number = 21;
let active: boolean = true;


// ----------------------------------------------
// 2. Arrays
// ----------------------------------------------
let skills: string[] = ["JS", "Node", "GenAI"];


// ----------------------------------------------
// 3. Object typing
// ----------------------------------------------
let user: { name: string; age: number } = {
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
```

---

# 5. REAL GENAI EXAMPLES

## Example 1 — Tool Argument Schema

```
interface SearchToolArgs {
  query: string;
  limit?: number;
}
```

Agents then use:

```
function searchTool(args: SearchToolArgs) {
  ...
}
```

---

## Example 2 — Agent State Typing

```
type AgentState = {
  messages: string[];
  memory: Record<string, any>;
};
```

---

## Example 3 — RAG Metadata Types

```
interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
}
```

This helps avoid corrupted vector data.

---

# 6. INTUITION SUMMARY

JavaScript is flexible but unsafe.
TypeScript adds structure, safety, and predictability.

In GenAI engineering:

* Types prevent wrong model outputs
* Types prevent bad tool-calling arguments
* Types make RAG stable
* Types ensure agent pipelines are consistent

Your future modules (LangChainJS, LangGraph, MCP) will be much easier with TypeScript.

---

# 7. PRACTICE QUESTIONS

1. What is the difference between interface and type?
2. Why are optional properties useful?
3. How do you annotate an async function returning a string?
4. What is a union type? Give an example.
5. Write a type for a GenAI tool that takes {text: string; maxTokens: number}.

---