# MODULE 0 → 0.1 JavaScript Foundations

# Topic 4 — Error Handling (Sync + Async)

---

# 1. CONCEPT SUMMARY

This topic covers:

1. Why errors happen
2. Types of errors
3. try / catch
4. finally
5. throw (custom errors)
6. Error handling in async/await
7. Error propagation
8. Clean error-handling patterns for GenAI apps

This is not a difficult topic, but it’s extremely important.

---

# 2. WHY THIS MATTERS IN GENAI ENGINEERING

Every GenAI API call:

```
await model.generateContent()
```

can fail.

If you do not handle errors properly:

* your agent may stop
* your RAG pipeline may break
* your server will crash
* your retries will not work
* your stream will hang

Good error handling = reliable AI system.

---

# 3. THEORY (Easy, Clean)

## 3.1 Why do errors happen?

Common reasons:

* Invalid input
* Network failure
* Rate limits
* Missing API keys
* Wrong parameters
* Unexpected responses

---

## 3.2 try / catch (sync code)

```
try {
  // risky code
} catch (err) {
  // handle error
}
```

---

## 3.3 finally

Code inside finally always runs.

```
try {
  console.log("Start");
} catch (err) {
  console.log("Error");
} finally {
  console.log("Always runs");
}
```

---

## 3.4 throw (creating custom errors)

```
throw new Error("Something went wrong");
```

throw immediately stops execution.

---

## 3.5 Error handling in async/await (VERY IMPORTANT)

```
try {
  const result = await fetchData();
} catch (err) {
  console.log("Async error:", err);
}
```

This pattern is used in **every GenAI tool or agent function**.

---

## 3.6 Error Propagation in async

If an async function throws, the caller must catch it.

```
async function a() {
  throw new Error("A failed");
}

async function b() {
  await a();  // b also fails unless handled
}
```

---

## 3.7 Clean Error Pattern (Production Style)

```
async function safeRun(fn) {
  try {
    return [null, await fn()];
  } catch (err) {
    return [err, null];
  }
}
```

You will use this later for:

* agent tools
* RAG steps
* retry wrappers
* parallel pipelines

But we keep it simple for now.

---

# 4. CODE EXAMPLES (simple only)

Create file:

```
GenAI/Topics/Module0/04-error-handling.js
```

Code:

```js
/*
   Error handling basics for sync and async code.
   Very simple examples only.
*/

// ----------------------------------------------
// 1. Basic try/catch
// ----------------------------------------------
try {
  const x = 10;
  x = 20;  // TypeError (cannot change const)
} catch (err) {
  console.log("Error caught:", err.message);
}


// ----------------------------------------------
// 2. finally always runs
// ----------------------------------------------
try {
  console.log("Inside try");
} catch (err) {
  console.log("Error happened");
} finally {
  console.log("Finally block executed");
}


// ----------------------------------------------
// 3. throw custom error
// ----------------------------------------------
function checkAge(age) {
  if (age < 18) {
    throw new Error("Age must be 18+");
  }
  return "Allowed";
}

try {
  console.log(checkAge(15));
} catch (err) {
  console.log("Caught:", err.message);
}


// ----------------------------------------------
// 4. Async try/catch
// ----------------------------------------------
function fakeApiCall() {
  return new Promise((resolve, reject) => {
    reject("API failed");  // simple easy example
  });
}

async function run() {
  try {
    const data = await fakeApiCall();
    console.log(data);
  } catch (err) {
    console.log("Async error caught:", err);
  }
}

run();


// ----------------------------------------------
// 5. Error Propagation (simple demonstration)
// ----------------------------------------------
async function a() {
  throw new Error("A failed");
}

async function b() {
  try {
    await a();
  } catch (err) {
    console.log("Error from A handled in B:", err.message);
  }
}

b();
```

---

# 5. INTUITION SUMMARY

Errors are normal.
Your job is not to prevent them.
Your job is to **control how your program reacts**.

Async functions must use try/catch, or they will fail silently.

Good GenAI systems never crash; they respond gracefully.

---

# 6. REAL GENAI USE-CASE

## Example: Gemini API Wrapper with Error Handling

We keep it simple:

```
async function askGemini(model, prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    return "LLM error. Please try again.";
  }
}
```

We will improve this in future modules, but this is enough for now.

---

# 7. PRACTICE QUESTIONS

1. What does try/catch do?
2. What is finally used for?
3. What happens when you throw inside a function?
4. Write a simple async function that throws an error.
5. Write a wrapper that catches async errors and returns null.
6. What happens if an async function throws and nobody catches it?

---