# MODULE 0 → 0.1 JavaScript Foundations

## Topic 6 — Classes + Object-Oriented Programming (OOP)

---

# 1. CONCEPT SUMMARY

This topic covers:

1. What is a Class
2. Constructor
3. Properties vs Methods
4. `this` keyword
5. Instances
6. Inheritance (`extends`)
7. Method overriding (`super`)
8. Private fields
9. Static methods
10. Why OOP matters in real GenAI systems

---

# 2. WHY THIS MATTERS FOR GENAI ENGINEERING

In actual GenAI codebases:

* You create reusable tools
* You store agent state
* You build custom retrievers
* You wrap API logic in classes
* You create configurable pipelines
* Your GeminiClient wrapper is already partially OOP

Classes help you write scalable, maintainable GenAI code that grows with complexity.

Almost every production-level AI system uses OOP structure.

---

# 3. THEORY — SIMPLE + CLEAR

## 3.1 What is a Class?

A blueprint to create objects.

```
class User {}
```

You create objects using `new`.

```
const u = new User();
```

---

## 3.2 Constructor

Special method that runs when object is created.

```
class User {
  constructor(name) {
    this.name = name;
  }
}
```

---

## 3.3 Methods

Functions inside a class.

```
class User {
  greet() {
    return "Hello";
  }
}
```

---

## 3.4 this Keyword

`this` refers to the object that calls the method.

---

## 3.5 Inheritance

```
class Child extends Parent {}
```

Inheritance gives:

* Reusability
* Shared logic
* Cleaner design

---

## 3.6 super()

Used to call methods from parent class.

---

## 3.7 Private Fields (#)

```
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }
}
```

Used for secure data.

---

## 3.8 Static Methods

Belong to the class, not instances.

```
static info() {}
```

Used to create helpers like:

```
Agent.createDefault()
```

---

# 4. CODE EXAMPLES (BEGINNER + INTERMEDIATE)

Create:

```
GenAI/Topics/Module0/06-classes-oop.js
```

Paste this code:

```js
/*
   ES6 Classes + OOP fundamentals
   Extremely important for GenAI architecture
*/

// ----------------------------------------------
// 1. Simple class with constructor
// ----------------------------------------------
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  greet() {
    return `Hello, I am ${this.name}`;
  }
}

const u1 = new User("Tanish", "Developer");
console.log(u1.greet());


// ----------------------------------------------
// 2. Inheritance example
// ----------------------------------------------
class Agent {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    return `I am agent ${this.name}`;
  }
}

class GeminiAgent extends Agent {
  constructor(name, model) {
    super(name); // Call parent constructor
    this.model = model;
  }

  useModel() {
    return `Using model ${this.model}`;
  }
}

const g1 = new GeminiAgent("Astra", "Gemini-2.0-pro");
console.log(g1.introduce());
console.log(g1.useModel());


// ----------------------------------------------
// 3. Private fields (#)
// ----------------------------------------------
class ApiRateLimiter {
  #count = 0;    // private field
  #limit = 3;

  attempt() {
    if (this.#count >= this.#limit) {
      return "Rate limit exceeded";
    }
    this.#count++;
    return `Allowed (${this.#count}/${this.#limit})`;
  }
}

const limiter = new ApiRateLimiter();
console.log(limiter.attempt());
console.log(limiter.attempt());
console.log(limiter.attempt());
console.log(limiter.attempt());  // Exceeded


// ----------------------------------------------
// 4. Static methods
// ----------------------------------------------
class Utils {
  static timestamp() {
    return new Date().toISOString();
  }
}

console.log(Utils.timestamp());
```

---

# 5. INTUITION SUMMARY

A class is like a machine blueprint.
You make multiple machines (objects) from it.

Closures give you *private state*,
but classes give you *structured objects* with:

* state
* behavior
* inheritance
* organization

This is why big GenAI projects use classes for:

* memory managers
* tool wrappers
* agent runners
* RAG pipelines
* safety layers

---

# 6. REAL GENAI USE CASES

## 1. Wrapper around Gemini API

```
class GeminiService {
  constructor(aiClient) {
    this.ai = aiClient;
  }

  async chat(prompt) {
    return await this.ai.generateText({ prompt });
  }
}
```

---

## 2. Tool System (like LangChain)

```
class SummarizeTool {
  async run(text) {
    return `Short: ${text.slice(0, 30)}...`;
  }
}
```

---

## 3. Agent Class

```
class Agent {
  constructor(tools) {
    this.tools = tools;
  }

  async execute(input) {}
}
```

OOP makes agents scalable.

---

# 7. PRACTICE QUESTIONS

1. What is the difference between constructor and method?
2. How does inheritance improve code architecture?
3. Write a class `ChatMemory` that stores messages.
4. Write a class `RetryWrapper` using closure inside class.
5. What are private fields and why used in rate limiting?
6. Explain static vs instance methods.
7. Why is OOP important in large GenAI systems?

---