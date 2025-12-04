# MODULE 0 → 0.1 → TOPIC 3

# Promises & async/await

---

# 1. CONCEPT SUMMARY

This topic covers:

1. Why async exists
2. What is a Promise
3. Promise states
4. then / catch / finally
5. async/await (syntax + intuition)
6. Error handling in async
7. Parallel vs Sequential async
8. Promise.all / allSettled / race / any
9. Real-world GenAI examples

---

# 2. WHY ASYNC MATTERS IN GENAI ENGINEERING

Every LLM API call returns a Promise.

Example:

```
const model = ai.getGenerativeModel(...);
const response = await model.generateContent(...);
```

If you don’t understand Promises:

* your agents will break
* your tools won’t work
* retry logic will fail
* streaming responses won’t behave correctly
* you will create race conditions in RAG or embeddings pipelines

Async is the execution backbone of all GenAI systems.

---

# 3. THEORY — CLEAR AND DEEP

## 3.1 Why JavaScript Needed Async

JavaScript runs on a single thread.

If long operations (API calls, file read, network requests) block the thread, the program freezes.

Async solves this by:

1. Starting operation
2. Releasing thread
3. Notifying when operation is done

This is done via **Promises**.

---

## 3.2 What is a Promise?

A Promise represents a value that will be available in the future.

It has **3 states**:

1. pending
2. fulfilled
3. rejected

---

## 3.3 Creating a Promise

```
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("done");
  }, 1000);
});
```

---

## 3.4 Consuming Promises (then/catch)

```
p.then(result => console.log(result))
 .catch(err => console.log(err));
```

---

## 3.5 async/await (modern way)

Simplifies Promise handling.

```
async function run() {
  const result = await p;
  console.log(result);
}
```

await pauses execution of current function until Promise resolves.

---

## 3.6 Error Handling in async/await

```
try {
  const data = await getData();
} catch (err) {
  console.log("Error:", err);
}
```

---

## 3.7 Parallel vs Sequential async

### Sequential (slow but controlled)

```
await task1();
await task2();
await task3();
```

### Parallel (fast)

```
await Promise.all([task1(), task2(), task3()]);
```

Used heavily in:

* embeddings generation
* chunk processing
* parallel RAG retrieval
* multi-agent execution

---

## 3.8 Promise Utilities

### Promise.all

Fails if any Promise fails.

### Promise.allSettled

Waits for all, never fails.

### Promise.race

Returns first completed Promise.

### Promise.any

Returns first fulfilled Promise (ignores failures).

---

# 4. SOURCE CODE (with full explanation)

Create file:

```
GenAI/Topics/Module0/03-promises-async-await.js
```

Code:

```js
/*
   Promises and async/await fundamentals.
   Everything here directly applies to GenAI API calls.
*/


// ----------------------------------------------
// 1. Basic Promise
// ----------------------------------------------
const simplePromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Task finished");
  }, 1000);
});

simplePromise.then(result => console.log(result));


// ----------------------------------------------
// 2. Rejecting a Promise
// ----------------------------------------------
const failingPromise = new Promise((resolve, reject) => {
  reject("Something went wrong");
});

failingPromise.catch(err => console.log(err));


// ----------------------------------------------
// 3. async/await basic usage
// ----------------------------------------------
async function runAsyncExample() {
  const result = await simplePromise;
  console.log("Await result:", result);
}

runAsyncExample();


// ----------------------------------------------
// 4. Error handling with async/await
// ----------------------------------------------
async function runWithError() {
  try {
    await failingPromise;
  } catch (err) {
    console.log("Caught error:", err);
  }
}

runWithError();


// ----------------------------------------------
// 5. Sequential async tasks
// ----------------------------------------------
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sequential() {
  console.log("Start sequential");
  await delay(1000);
  console.log("Step 1 done");
  await delay(1000);
  console.log("Step 2 done");
}

sequential();


// ----------------------------------------------
// 6. Parallel async tasks (fast)
// ----------------------------------------------
async function parallel() {
  console.log("Start parallel");

  await Promise.all([
    delay(1000),
    delay(1000),
    delay(1000),
  ]);

  console.log("All parallel tasks done");
}

parallel();


// ----------------------------------------------
// 7. Promise.allSettled usage
// ----------------------------------------------
const p1 = Promise.resolve("Success");
const p2 = Promise.reject("Failure");

Promise.allSettled([p1, p2]).then(result => {
  console.log("All Settled:", result);
});


// ----------------------------------------------
// 8. Real-world: GenAI call wrapper using async
// ----------------------------------------------
async function callGemini(model, prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log("Gemini error:", err);
  }
}

/*
   This wrapper can be used in:
   - RAG
   - Agent tool-calling
   - Chat loops
   - Streaming
*/
```

---

# 5. INTUITION SUMMARY

Async flows are simple:

1. JavaScript starts a task
2. It continues running the rest of the code
3. When the task finishes, it notifies via Promise
4. await pauses the function execution until Promise resolves

Async allows JS to multitask without blocking the thread.

---

# 6. REAL GENAI EXAMPLES

## Example 1: Generating multiple embeddings in parallel

```
await Promise.all(
  chunks.map(chunk => embeddingModel.embed(chunk))
);
```

## Example 2: Multiple agent tools executing together

```
const [weather, news] = await Promise.all([
  agent.callWeatherTool(),
  agent.callNewsTool(),
]);
```

## Example 3: Retry wrapper using async/await

```
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) { }
  }
  throw new Error("Retry failed");
}
```

---

# 7. PRACTICE QUESTIONS

1. What is a Promise?
2. Difference between then/catch and async/await?
3. What are the three states of a Promise?
4. Write a function that returns a Promise resolving after 2 seconds.
5. Convert then/catch code to async/await.
6. When would you use Promise.all vs sequential awaits?
7. What is Promise.allSettled used for?
8. Explain parallel async execution with an example.

---
