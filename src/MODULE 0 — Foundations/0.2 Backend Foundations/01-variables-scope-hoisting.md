# MODULE 0 — FOUNDATIONS

## 0.1 JavaScript Foundations

### Topic 1 — Variables, Scope, Hoisting

---

# 1. Concept Summary

This topic covers:

1. What are variables
2. Difference between var, let, const
3. Scope (global, function, block scope)
4. Shadowing
5. Hoisting (what gets hoisted and how)
6. Temporal Dead Zone (TDZ)

This is the foundation of how JS executes code. Understanding this is essential for writing correct async + agent logic later.

---

# 2. Why This Topic Is Important For GenAI Engineering

When writing GenAI apps (agents, tools, pipelines):

1. You write **a lot of async code**, so understanding variable lifetime is critical.
2. Misusing scope can lead to bugs in prompts, state, or agent memory.
3. Hoisting helps you understand execution order, which matters in complex workflows.
4. let/const usage prevents silent failures when handling API responses.

This is not “basic JavaScript”.
This is execution model knowledge required for building robust systems.

---

# 3. Detailed Theory (Clear and Deep Understanding)

## 3.1 VARIABLES: var vs let vs const

| Feature    | var                                | let            | const                   |
| ---------- | ---------------------------------- | -------------- | ----------------------- |
| Scope      | Function-scoped                    | Block-scoped   | Block-scoped            |
| Hoisting   | Hoisted (initialized to undefined) | Hoisted (TDZ)  | Hoisted (TDZ)           |
| Reassign   | Yes                                | Yes            | No                      |
| Redeclare  | Yes                                | No             | No                      |
| Common Use | Avoid                              | Use by default | For constant references |

### Explanation:

* var is old JS. It behaves unpredictably in blocks because it ignores them.
* let is modern. Value can change, but scope is restricted to `{ }`.
* const guarantees the variable cannot be reassigned.

In modern GenAI development (Node.js, TypeScript), we **never** use var.

---

## 3.2 Scope Types

### Global Scope

Accessible everywhere in the file.

### Function Scope

Created inside a function. Only accessible inside the function.

### Block Scope

Everything inside `{ }` including:

* if blocks
* loops
* try-catch
* anything using braces

let and const respect block scope.

var does not.

---

## 3.3 Shadowing

A variable declared inside a block can hide (shadow) a variable with the same name in outer scope.

Example:

```
let x = 10;

{
   let x = 20; // this shadows outer x
   console.log(x); // 20
}

console.log(x); // 10
```

---

## 3.4 Hoisting

Hoisting means JavaScript **moves declarations to the top of their scope** during the compilation phase.

But different variables behave differently:

### var

* Hoisted
* Initialized as undefined

### let, const

* Hoisted
* Not initialized
* Placed in Temporal Dead Zone until their line executes

### TDZ (Temporal Dead Zone)

If you access a let/const variable before initialization, you get a ReferenceError.

```
console.log(a);  
let a = 10;
```

This gives error.

But:

```
console.log(a);  
var a = 10;
```

This prints undefined.

---

# 4. Code Implementation (with detailed comments)

Create file:

```
GenAI/Topics/Module0/01-variables-scope-hoisting.js
```

Here is the example code:

```js
/* 
   Demonstration of variables, scope, hoisting, TDZ.
   This file is purely conceptual, not part of Gemini API logic.
*/

// ----------------------------------------------
// 1. var vs let vs const
// ----------------------------------------------
var a = 10;        // var → function scoped, hoisted with default undefined
let b = 20;        // let → block scoped, hoisted but TDZ
const c = 30;      // const → block scoped and cannot be reassigned

console.log(a, b, c);


// ----------------------------------------------
// 2. Block scope example
// ----------------------------------------------
if (true) {
  var x = "var inside block";    // escapes block (bad behavior)
  let y = "let inside block";    // stays inside block
  const z = "const inside block";

  console.log("Inside block:", x, y, z);
}

console.log("Outside block:", x);     // works
// console.log(y);  // ReferenceError
// console.log(z);  // ReferenceError


// ----------------------------------------------
// 3. Function scope example
// ----------------------------------------------
function testScope() {
  var f1 = "var in function";
  let f2 = "let in function";
  const f3 = "const in function";

  console.log("Inside function:", f1, f2, f3);
}

testScope();

// console.log(f1); // ReferenceError (function scoped)
// console.log(f2); // ReferenceError
// console.log(f3); // ReferenceError


// ----------------------------------------------
// 4. Hoisting: var
// ----------------------------------------------
console.log(h1);   // undefined because var gets hoisted
var h1 = 100;


// ----------------------------------------------
// 5. Hoisting: let + TDZ
// ----------------------------------------------
// console.log(h2); // ReferenceError: TDZ
let h2 = 200;


// ----------------------------------------------
// 6. Shadowing
// ----------------------------------------------
let outer = "outer";

{
  let outer = "shadowed inner";
  console.log("Inner value:", outer);
}

console.log("Outer value:", outer);
```

---

# 5. Intuition Summary (1 paragraph)

JavaScript runs code in two steps:

1. It creates memory for variables (hoisting phase)
2. Then it executes line-by-line

var is old and hoisted with undefined.
let and const are hoisted but kept uninitialized (TDZ) until their actual line executes.
Block scope ensures predictability.
This behavior affects async logic, API calls, and agent state, so mastering this is required before moving to GenAI topics.

---

# 6. Real-world Relevance for GenAI Work

Example: You store an API response inside a block, but try to use it outside.

```
if (response.ok) {
   let data = await response.json();
}

console.log(data);  // ReferenceError
```

This happens when devs misunderstand scope.
Your agents, RAG pipelines, and streaming logic must avoid these mistakes.

---

# 7. Practice Questions

Answer them after understanding.

1. What is hoisting in simple words?
2. Why should var be avoided?
3. What is the difference between block scope and function scope?
4. Explain Temporal Dead Zone with an example.
5. What happens if you redeclare a let variable?
6. How does shadowing work?
7. Why does console.log(varVariable) print undefined but letVariable causes error?

---
