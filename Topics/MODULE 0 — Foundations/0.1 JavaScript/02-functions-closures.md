# MODULE 0 → 0.1 JavaScript Foundations → Topic 2

# **Functions & Closures**

This topic is extremely important for GenAI engineering because:

• Agents use functions as tools
• LangChainJS and MCP rely heavily on closures
• Async workflows and state machines internally use closures
• Prompt-building pipelines are function-based

We will cover everything in a structured, professional manner as always.

---

# 1. CONCEPT SUMMARY

This topic covers:

1. What is a function
2. Function declaration vs expression vs arrow function
3. Parameters, arguments, return values
4. First-class functions
5. Higher-order functions
6. Lexical environment
7. Closures (deep explanation)
8. Real-world uses of closures in GenAI apps

---

# 2. WHY THIS TOPIC MATTERS FOR GENAI ENGINEERING

In real GenAI systems:

1. When you build **tool-calling agents**, each tool is a function.
2. When you create **stateful pipelines**, closures store state without global variables.
3. Streaming, retries, caching, and batching rely on closures.
4. MCP and LangGraph use functions that preserve hidden state.

If you understand closures, you understand 50% of how modern JS GenAI frameworks work.

---

# 3. THEORY — DEEP, CLEAR UNDERSTANDING

## 3.1 What is a Function?

A function is a reusable block of code that:

• Takes input (parameters)
• Performs some logic
• Produces output (return value)

In JS, functions are *objects*, which means they can be:

* stored in variables
* passed as arguments
* returned from other functions

This makes JavaScript extremely powerful.

---

## 3.2 Types of Functions

### 1. Function Declaration

```
function add(a, b) {
  return a + b;
}
```

Hoisted completely.

### 2. Function Expression

```
const multiply = function (a, b) {
  return a * b;
};
```

Not hoisted like declarations.

### 3. Arrow Function

```
const divide = (a, b) => a / b;
```

Arrow functions do not create their own `this` or `arguments`.
Used heavily in GenAI JS client code.

---

## 3.3 First-Class Functions

JavaScript treats functions as values.

Meaning you can:

```
const x = function() {};
```

or

```
function doSomething(fn) {
  fn();
}
```

or

```
return function() {};
```

This allows higher-order patterns like:

* retry wrappers
* caching wrappers
* middleware
* agent tools

---

## 3.4 Higher Order Functions (HOF)

A function that:

• takes a function as input
• returns a function

Example:

```
function applyTwice(fn) {
  return function (value) {
    return fn(fn(value));
  };
}
```

Used in:

* safety wrappers
* evaluator functions
* throttling wrappers
* LangChain Runnables

---

## 3.5 Lexical Environment (Core of Closures)

A function remembers:

1. Its own local variables
2. Variables from outer function
3. Variables from global scope

This is called the lexical scope chain.

The function’s ability to “remember” these variables later is closure.

---

## 3.6 Closures (Simple → Deep)

### Simple Definition

A closure is when a function *remembers the variables of the place where it was created*, even after that place is gone.

### Why Closures Happen

Because JS does not copy variables; it stores **references to the environment** where the function was originally defined.

### Closure Example (Simplest)

```
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const fn = outer();
fn(); // 1
fn(); // 2
```

Even though `outer()` has finished executing, `inner()` still remembers `count`.

This is closure.

---

# 4. SOURCE CODE (with detailed comments)

Create file:

```
GenAI/Topics/Module0/02-functions-closures.js
```

Contents:

```js
/*
   Demonstration of functions, lexical scope, and closures.
   These concepts are used heavily in GenAI tool functions and agent workflows.
*/

// ----------------------------------------------
// 1. Function Declaration
// ----------------------------------------------
function greet(name) {
  return `Hello, ${name}`;
}

console.log(greet("Tanish"));


// ----------------------------------------------
// 2. Function Expression
// ----------------------------------------------
const add = function (a, b) {
  return a + b;
};

console.log(add(10, 20));


// ----------------------------------------------
// 3. Arrow Function
// ----------------------------------------------
const multiply = (a, b) => a * b;

console.log(multiply(5, 3));


// ----------------------------------------------
// 4. First-class functions (passing as argument)
// ----------------------------------------------
function operate(operationFn, value) {
  return operationFn(value);
}

const square = (num) => num * num;

console.log(operate(square, 4));  // 16


// ----------------------------------------------
// 5. Higher-order function (returns a function)
// ----------------------------------------------
function makeMultiplier(factor) {
  return function (value) {
    return factor * value;
  };
}

const double = makeMultiplier(2);
console.log(double(10));   // 20


// ----------------------------------------------
// 6. Closure Example
// ----------------------------------------------
function counter() {
  let count = 0;  // captured by closure

  function increment() {
    count++;
    return count;
  }

  return increment;
}

const c1 = counter();

console.log(c1()); // 1
console.log(c1()); // 2
console.log(c1()); // 3


// ----------------------------------------------
// 7. Closure with private data (real use-case)
// ----------------------------------------------
function createApiLimiter(limit) {
  let calls = 0;

  return function () {
    calls++;
    if (calls > limit) {
      return "Limit exceeded";
    }
    return `Call ${calls} allowed`;
  };
}

const apiLimiter = createApiLimiter(3);

console.log(apiLimiter());  // Call 1 allowed
console.log(apiLimiter());  // Call 2 allowed
console.log(apiLimiter());  // Call 3 allowed
console.log(apiLimiter());  // Limit exceeded
```

---

# 5. INTUITION SUMMARY

Closures happen because:

1. A function keeps a reference to its lexical environment
2. That reference stays alive even after the outer function finishes
3. This allows state to remain private and persistent

Agents, tools, retries, memories, rate-limiters all use closures under the hood.

---

# 6. REAL-WORLD GENAI USE CASE

### 1. Retry Wrapper (closure stores retries left)

```
function retryableTool(toolFn, limit) {
  let attempts = 0;

  return async function (...args) {
    attempts++;
    if (attempts > limit) {
      throw new Error("Retry limit reached");
    }
    return toolFn(...args);
  };
}
```

### 2. Shared Agent Memory

```
function createMemory() {
  let messages = [];

  return {
    add(msg) { messages.push(msg); },
    get() { return messages; }
  };
}
```

Memory persists because of closure.

---

# 7. PRACTICE QUESTIONS

1. What is difference between function declaration vs expression?
2. Why arrow functions do not have their own this?
3. Define closure in one line.
4. Write a closure that keeps track of login attempts.
5. What is lexical scope?
6. Build a multiplier function using closure.
7. Explain how closures help in GenAI tool functions.

---
