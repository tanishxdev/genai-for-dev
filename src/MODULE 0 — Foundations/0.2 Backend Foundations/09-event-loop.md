# MODULE 0 → 0.1 JavaScript Foundations

# Topic 9 — Event Loop & Microtasks

This is one of the **most important core topics** for any backend + GenAI engineer.

Why?

Because:

1. GenAI apps rely heavily on async operations (fetch, axios, streaming, embeddings, vector DB queries).
2. Agents run multiple tools in parallel or in sequence.
3. RAG pipelines depend on async file I/O + network calls.
4. Misunderstanding event loop order leads to subtle, hard bugs.

A real AI engineer must understand **how Node.js schedules tasks**.

We go deep, step-by-step, but easy.

---

# 1. CONCEPT SUMMARY

This topic includes:

1. What is the event loop
2. Call stack
3. Web APIs / Node APIs
4. Task queues
5. Microtasks vs Macrotasks
6. Promise execution order
7. Await, async, and scheduling
8. Why this matters in GenAI apps

---

# 2. WHY THIS MATTERS IN GENAI ENGINEERING

Your AI system runs:

* multiple LLM calls
* streamed responses
* tool-calling callbacks
* retries, scheduling
* file read/write
* embedding generation

If you do not understand event loop, your code may:

* freeze
* block execution
* produce out-of-order outputs
* cause tool-calling races
* break parallel agent execution

GenAI frameworks (LangChainJS, LangGraph) are **built on top of async execution**.

This topic gives you the mental model required.

---

# 3. THEORY (Simple + Deep)

---

## 3.1 Call Stack (Where JS executes code)

JavaScript uses a single thread.

When functions run, they get pushed onto the call stack.

When finished, they pop off.

---

## 3.2 Web APIs / Node APIs

Async operations like:

* fetch
* setTimeout
* fs.readFile
* network requests

are not executed on the main thread.

They are handed to background workers.

---

## 3.3 Task Queues

After background work completes, callbacks get scheduled into queues.

Two important queues:

### 1. Microtask Queue

Contains:

* Promise callbacks
* async/await resolution
* queueMicrotask()

Runs **before** other tasks.
Runs until empty.

### 2. Macrotask Queue

Contains:

* setTimeout
* setInterval
* I/O callbacks
* setImmediate

Runs **after** microtasks.

---

# 3.4 Execution Order Summary

Execution flow:

1. Run synchronous code
2. Process all microtasks
3. Process one macrotask
4. Repeat from step 2

Microtasks have priority.

---

# 3.5 async / await

`await` pauses execution inside an async function.

It is syntactic sugar over Promises.

Example:

```
await fetch()  
```

means:

```
fetch()
  .then(...)
```

Which is handled in microtask queue.

---

# 3.6 Important Rule

**Promise callbacks always run before setTimeout callbacks.**

Even with timeout = 0.

---

# 4. CODE EXAMPLES

Create file:

```
GenAI/Topics/Module0/09-event-loop.js
```

Put this code inside:

```js
/* 
   Topic: Event Loop & Microtasks
   Purpose: Understand task ordering for GenAI engineering.
*/

// --------------------------------------------------
// 1. Microtasks vs Macrotasks
// --------------------------------------------------
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise callback (microtask)");
});

console.log("End");


// Expected Output:
// Start
// End
// Promise callback (microtask)
// Timeout callback (macrotask)


// --------------------------------------------------
// 2. Async/Await ordering
// --------------------------------------------------
async function demo() {
  console.log("A");

  await Promise.resolve();
  
  console.log("B");
}

demo();
console.log("C");

// Expected Output:
// A
// C
// B


// --------------------------------------------------
// 3. queueMicrotask example
// --------------------------------------------------
queueMicrotask(() => {
  console.log("Microtask from queueMicrotask");
});

console.log("Main code");


// --------------------------------------------------
// 4. Heavy synchronous block (blocking the loop)
// --------------------------------------------------
function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

console.log("Blocking for 100ms...");
blockFor(100);
console.log("Done blocking");

/*
Real-world warning:
If you block the event loop in GenAI apps,
LLM streaming stops, agents freeze, retries fail.
*/
```

---

# 5. REAL GENAI EXAMPLES

## Example 1 — Streaming Responses

Streaming chunks arrive in **macrotasks**, but processing them uses microtasks.

If you block the event loop, streaming freezes.

---

## Example 2 — Multiple parallel AI calls

```
await Promise.all([
  callEmbeddingAPI(),
  callModel(),
  callVectorDB()
]);
```

This uses microtasks heavily.

---

## Example 3 — Tool-calling execution

A tool may return output in a microtask, but agent planning may occur in a macrotask.

Understanding this avoids race conditions.

---

# 6. INTUITION SUMMARY

The event loop decides:

* what runs now
* what waits
* what runs next

Microtasks (promises) always run before macrotasks (timers, I/O).

Async/await is just a wrapper around microtasks.

Understanding the event loop allows you to build stable, efficient, and bug-free GenAI pipelines.

---

# 7. PRACTICE QUESTIONS

1. What is the call stack?
2. What is the difference between microtask and macrotask queues?
3. Which runs first: setTimeout(fn, 0) or Promise.then()? Why?
4. What happens when you block the event loop?
5. Why is event loop knowledge essential for streaming responses?

---
