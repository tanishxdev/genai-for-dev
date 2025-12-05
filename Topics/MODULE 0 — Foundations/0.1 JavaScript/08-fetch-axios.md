# MODULE 0 → 0.1 JavaScript Foundations

# Topic 8 — Fetch / Axios (HTTP Requests)

This topic is extremely important because:

1. All GenAI work is API-driven.
2. You will constantly call:

   * Gemini API
   * OpenAI API
   * Groq API
   * Vector DB APIs
   * Embedding endpoints
   * Internal microservices
3. Agents, tools, RAG pipelines → all require HTTP calls.

Understanding Fetch & Axios deeply means you can build stable, secure, production-ready API clients.

We go slow, structured, clean.

---

# 1. CONCEPT SUMMARY

This topic covers:

1. What is HTTP request handling
2. Fetch API (built-in)
3. Axios (external library)
4. Request methods (GET, POST, PUT, DELETE)
5. Headers
6. Body formats
7. Error handling
8. Timeouts & retries
9. Best practices for GenAI API clients

---

# 2. WHY THIS MATTERS IN GENAI ENGINEERING

Every GenAI system requires:

* calling LLM inference endpoints
* calling embeddings API
* uploading files
* downloading model responses
* batching multiple parallel API calls
* sending streaming requests
* retrying on failure
* detecting rate limits

If you don’t master HTTP requests, your GenAI pipeline will:

* crash under rate limit
* break when responses change
* produce undefined errors
* become unscalable

This topic directly improves your agent performance.

---

# 3. THEORY (Simple, Deep)

---

## 3.1 Fetch API (built-in)

Fetch is available in:

* modern Node.js
* browsers
* serverless platforms

Basic GET:

```js
const res = await fetch("https://api.example.com/data");
const data = await res.json();
```

Basic POST:

```js
const res = await fetch("https://api.example.com/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ msg: "Hello" })
});
```

---

## 3.2 Axios (external library)

Axios advantages:

1. Automatic JSON conversion
2. Better error messages
3. Interceptors (important for API logging)
4. Built-in timeout
5. Works better with retries

Basic GET:

```js
import axios from "axios";

const res = await axios.get("https://api.example.com/data");
```

Basic POST:

```js
await axios.post("https://api.example.com/send", {
  msg: "Hello"
});
```

---

## 3.3 Common Request Components

### Headers

```
"Content-Type": "application/json"
"Authorization": "Bearer API_KEY"
```

### Body (POST/PUT)

```
JSON.stringify(...)
```

### Status Codes

200 → OK
400 → Client error
401 → Auth error
429 → Rate limit (very important in GenAI)
500 → Server error

---

## 3.4 Timeouts (critical for LLM apps)

Fetch has no built-in timeout.

Axios:

```js
axios.get(url, { timeout: 5000 });
```

---

## 3.5 Retries (helps with rate-limits)

For LLM apps, network errors are common.

You must retry.

Pseudo:

```
try → fail → wait → retry → finally succeed
```

---

# 4. CODE EXAMPLES

Create:

```
GenAI/Topics/Module0/08-fetch-axios.js
```

Paste:

```js
/* 
   Topic: Fetch and Axios (HTTP Requests)
   Purpose: Learn how to call APIs reliably in GenAI projects.
*/

// ----------------------------------------------
// 1. Fetch: Basic GET
// ----------------------------------------------
async function fetchGetExample() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // Convert response to JS object
  const data = await res.json();
  console.log("Fetch GET:", data);
}

fetchGetExample();


// ----------------------------------------------
// 2. Fetch: Basic POST
// ----------------------------------------------
async function fetchPostExample() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "GenAI", body: "Learning", userId: 1 })
  });

  const data = await res.json();
  console.log("Fetch POST:", data);
}

fetchPostExample();


// ----------------------------------------------
// 3. Axios: Basic GET
// ----------------------------------------------
import axios from "axios";

async function axiosGetExample() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users/1");
  console.log("Axios GET:", res.data);
}

axiosGetExample();


// ----------------------------------------------
// 4. Axios: Basic POST
// ----------------------------------------------
async function axiosPostExample() {
  const res = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title: "GenAI Axios",
      body: "AI engineer",
      userId: 2
    }
  );

  console.log("Axios POST:", res.data);
}

axiosPostExample();


// ----------------------------------------------
// 5. Axios Timeout + Error Handling
// ----------------------------------------------
async function axiosWithTimeout() {
  try {
    const res = await axios.get("https://httpbin.org/delay/3", {
      timeout: 2000 // 2 seconds
    });
    console.log("Axios timeout test:", res.data);

  } catch (err) {
    console.log("Timeout or network error:", err.message);
  }
}

axiosWithTimeout();
```

This teaches you real, production-use patterns.

---

# 5. REAL GENAI EXAMPLES

## Example 1 — Upload file to Gemini

```
const res = await fetch(
  "https://api.google.com/upload",
  {
    method: "POST",
    headers: { "Authorization": `Bearer ${KEY}` },
    body: fileBuffer
  }
);
```

---

## Example 2 — Retry logic for rate limit

```
if (error.response?.status === 429) {
  await sleep(1000);
  retry();
}
```

---

## Example 3 — Batch model calls

```
const results = await Promise.all(
  queries.map(q => axios.post(apiUrl, { q }))
);
```

---

# 6. INTUITION SUMMARY

Fetch is lightweight and built-in.
Axios is powerful for production.

In GenAI engineering:

* use fetch for simple requests
* use axios for complex agent pipelines, retries, logging, and error handling

Large projects almost always use Axios.

---

# 7. PRACTICE QUESTIONS

1. What is the difference between fetch and axios?
2. Why does fetch require manual JSON parsing?
3. How do you set a timeout in Axios?
4. Write a POST request using fetch.
5. Write a GET request using axios that handles errors safely.

---
