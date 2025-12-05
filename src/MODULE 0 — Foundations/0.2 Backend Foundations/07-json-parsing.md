# MODULE 0 → 0.1 JavaScript Foundations

# Topic 7 — JSON Parsing & Serialization

This is one of the most used concepts in GenAI engineering because **all LLM inputs and outputs use JSON**, especially tool-calling, agent state, RAG metadata, embeddings, logs, etc.

We go slow and clean.

---

# 1. CONCEPT SUMMARY

JSON is the universal data format used by:

* LLM APIs (Gemini, OpenAI)
* Agents
* Tools
* LangChainJS
* Vector DBs
* Embedding stores
* Logging
* Safety validators

This topic covers:

1. What is JSON
2. JSON syntax rules
3. Converting JavaScript → JSON (stringify)
4. Converting JSON → JavaScript (parse)
5. Handling errors
6. JSON schema relevance in GenAI
7. Real-world examples from AI apps

---

# 2. WHY JSON MATTERS IN GENAI ENGINEERING

Modern GenAI systems rely heavily on JSON because:

1. Tool-calling requires structured JSON arguments
2. Agent state is stored as JSON
3. Model outputs are validated against JSON schema
4. RAG metadata and embeddings stored as JSON
5. Pipelines and workflows pass JSON payloads
6. API requests and streaming chunks are always JSON

If you don’t master JSON parsing, you will struggle with:

* invalid model output
* failed tool calls
* broken pipelines
* unsafe or inconsistent state

---

# 3. THEORY — SIMPLE AND DEEP

## 3.1 What is JSON?

A lightweight data format for structured information.

Example:

```
{
  "name": "Tanish",
  "age": 21,
  "skills": ["JS", "Node", "GenAI"]
}
```

### JSON restrictions:

1. Keys must be in double quotes
2. Values can be: string, number, boolean, null, object, array
3. No functions allowed
4. No comments allowed
5. No undefined values

---

## 3.2 JSON.stringify()

Converts JavaScript value → JSON string.

```
const obj = { name: "Tanish", age: 21 };

const json = JSON.stringify(obj);
console.log(json);
```

Output:

```
{"name":"Tanish","age":21}
```

---

## 3.3 JSON.parse()

Converts JSON string → JavaScript object.

```
const json = '{"name":"Tanish","age":21}';

const obj = JSON.parse(json);
console.log(obj.name);
```

---

## 3.4 Handling Invalid JSON

```
try {
  JSON.parse("invalid json");
} catch (err) {
  console.log("Parsing failed:", err.message);
}
```

You **must** catch parsing errors in agents because LLMs sometimes output malformed JSON.

---

## 3.5 Pretty Printing JSON

Useful for logs.

```
JSON.stringify(obj, null, 2);
```

Output:

```
{
  "name": "Tanish",
  "age": 21
}
```

---

## 3.6 Removing Sensitive Data (important in GenAI)

Example: Remove API keys from logs.

```
const safe = JSON.stringify(obj, (key, value) => {
  if (key === "apiKey") return "***";
  return value;
});
```

---

# 4. CODE EXAMPLES (Create Topic File)

Create:

```
GenAI/Topics/Module0/07-json-parsing.js
```

Put this code inside:

```js
/* 
   Topic: JSON Parsing & Serialization
   Purpose: Learn how to convert JS <-> JSON safely for GenAI projects.
*/

// ----------------------------------------------
// 1. JavaScript object → JSON string
// ----------------------------------------------
const user = {
  name: "Tanish",
  age: 21,
  skills: ["JS", "Node", "GenAI"]
};

const jsonString = JSON.stringify(user);
console.log("JSON String:", jsonString);


// ----------------------------------------------
// 2. Pretty JSON (for logs)
// ----------------------------------------------
const pretty = JSON.stringify(user, null, 2);
console.log("Pretty JSON:\n", pretty);


// ----------------------------------------------
// 3. JSON string → JS object
// ----------------------------------------------
const raw = '{"tool":"summarizer","input":"This is sample text"}';

const parsed = JSON.parse(raw);
console.log("Parsed object:", parsed);


// ----------------------------------------------
// 4. Invalid JSON handling
// ----------------------------------------------
try {
  JSON.parse("{invalid-json}");
} catch (error) {
  console.log("Error parsing JSON:", error.message);
}


// ----------------------------------------------
// 5. Removing sensitive fields (important for logs)
// ----------------------------------------------
const config = {
  apiKey: "SECRET_KEY_123",
  model: "gemini-pro"
};

const safeJSON = JSON.stringify(
  config,
  (key, value) => (key === "apiKey" ? "HIDDEN" : value),
  2
);

console.log("Safe Config:\n", safeJSON);
```

---

# 5. GENAI REAL-WORLD EXAMPLES

## Example 1: Model output validation

```
const output = await model.generateText(...);

let data;

try {
  data = JSON.parse(output.text());
} catch (e) {
  return "Model returned invalid JSON.";
}
```

---

## Example 2: Tool-Calling schema

Tools expect input as:

```
{
  "action": "search",
  "query": "node js tutorial"
}
```

You validate with:

```
JSON.parse(modelOutput);
```

---

## Example 3: Saving agent memory

```
await fs.writeFile("memory.json", JSON.stringify(memory, null, 2));
```

---

# 6. INTUITION SUMMARY

JSON is the language that all AI tools speak.

JavaScript object → JSON string → sent to model
Model returns JSON → parsed back into JavaScript
Agents, tools, pipelines all run on this cycle.

If JSON breaks, your system breaks.

---

# 7. PRACTICE QUESTIONS

1. What is the difference between JS objects and JSON?
2. Why can JSON not have comments or functions?
3. What happens if you try to parse invalid JSON?
4. How do you pretty-print JSON?
5. How do you safely remove sensitive fields before logging?

---
