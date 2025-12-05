# MODULE 0 → 0.1 JavaScript Foundations

# Topic 5 — ES Modules (import / export)

This topic is extremely important because your **entire GenAI project uses ESM**, including:

* geminiClient.js
* utils
* agents
* tools
* pipelines
* LangChainJS
* LangGraph
* MCP servers

Without strong understanding of modules, real-world GenAI apps become unorganized and buggy.

---

# 1. CONCEPT SUMMARY

This topic covers:

1. What are ES Modules
2. Why Node.js uses ESM today
3. export (default + named)
4. import (default + named)
5. Difference between CommonJS and ESM
6. File path rules
7. Best practices for GenAI project structure

We keep everything easy.

---

# 2. WHY MODULES MATTER IN GENAI ENGINEERING

Modern GenAI codebases are large.

You must separate:

* geminiClient (API connection)
* tools
* agents
* RAG helpers
* embedding functions
* vector DB helpers
* utility wrappers
* safety modules

If you put everything in one file, it becomes impossible to debug.

Modules keep your AI system:

* clean
* maintainable
* scalable
* testable

This is the foundation of the architecture you are building.

---

# 3. THEORY (Simple and Clear)

## 3.1 What is an ES Module?

A JavaScript file that uses:

```
import ...
export ...
```

Each file is treated like a separate “mini-program”.

---

## 3.2 export (makes something available to other files)

### Named Export

```
export const PI = 3.14;
export function add(a, b) { return a + b; }
```

### Default Export

```
export default function greet(name) {
  return `Hello ${name}`;
}
```

You can have **only one default export** per file.

---

## 3.3 import (bring exported items into another file)

### Importing Named Exports

```
import { PI, add } from "./math.js";
```

Names must match exactly.

### Importing Default Export

```
import greet from "./greet.js";
```

You can rename default imports freely:

```
import hello from "./greet.js";
```

### Importing Both

```
import greet, { add, PI } from "./utils.js";
```

---

## 3.4 File Extensions MUST be included in ESM

Correct:

```
import ai from "../utils/geminiClient.js";
```

Wrong:

```
import ai from "../utils/geminiClient";
```

---

## 3.5 Difference Between CommonJS & ESM (easy version)

| Feature            | CommonJS       | ES Modules   |
| ------------------ | -------------- | ------------ |
| Export             | module.exports | export       |
| Import             | require()      | import       |
| Default in Node.js | Older style    | Modern style |
| Async support      | No             | Yes          |

Your project already uses **pure ESM**, which is correct.

---

# 4. CODE EXAMPLES (Very Simple)

Create:

```
GenAI/Topics/Module0/05-es-modules.js
```

### File 1: math.js

```js
// Named exports
export const PI = 3.14;

export function add(a, b) {
  return a + b;
}
```

### File 2: greet.js

```js
// Default export
export default function greet(name) {
  return `Hello ${name}`;
}
```

### File 3: main.js

```js
// Importing named exports
import { PI, add } from "./math.js";

// Importing default export
import greet from "./greet.js";

console.log("PI =", PI);
console.log("Add =", add(10, 20));
console.log(greet("Tanish"));
```

Run:

```
node main.js
```

Output:

```
PI = 3.14
Add = 30
Hello Tanish
```

Simple, clean.
No advanced features.
Only fundamentals.

---

# 5. REAL GENAI EXAMPLES (easy)

## Example 1: Importing your gemini client

```
import ai from "../utils/geminiClient.js";
```

## Example 2: Exporting a basic GenAI tool

File: tools/summarize.js

```js
export async function summarize(text) {
  return `Short summary: ${text.slice(0, 20)}...`;
}
```

---

## Example 3: Importing a tool inside agent

```
import { summarize } from "./tools/summarize.js";
```

---

# 6. INTUITION SUMMARY

Modules help you break a big program into small, manageable pieces.

Each file:

* focuses on one job
* exports useful functions
* imports needed tools

This structure is necessary for large GenAI architectures
where agents and RAG components must stay organized.

---

# 7. PRACTICE QUESTIONS

1. What is the difference between default and named export?
2. When should you use default exports?
3. Why do you need to write `.js` in ESM imports?
4. Write an example of a file exporting two functions.
5. Write a file importing those functions.

---