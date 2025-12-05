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


// --------------------------------------------------------------------------------
// 4. Static methods : Methods that belong to the class itself, not to any object.
// --------------------------------------------------------------------------------
// Matlab:
// Aapko class ka object banane ki zarurat nahi hai.
// You can call the method directly using ClassName.method().
// 
// JavaScript me static keyword ka use tab hota hai jab:
// 
// Method ka object se koi lena-dena nahi ho
// Behavior class-level ho, shared ho
// Utility/helper functions banana ho
// 
// Why static is used?
// 
// Because sometimes you don’t need an object.
// Example: timestamps, random ID generator, math utilities, hashing helper, etc.
// Agar aisa method object ke data ko use nahi kar raha, static banana best practice hota hai.
// 
// Step-by-step (Dry Run)
// 
// Class Utils define hoti hai.
// Iske andar ek method hai → timestamp().
// 
// Method ke aage static lagaya hai
// → Matlab object banaye bina call kar sakte ho.
// 
// timestamp() ka kaam:
// new Date() se current date-time lega
// .toISOString() me convert karega
// Example output: "2025-12-05T04:45:22.123Z"
// 
// console.log(Utils.timestamp())
// → Direct class se method call
// → Console me ISO format date-time print hota hai.
// 
// --------------------------------------------------------------------------------
// When to use static methods in GenAI projects?
// --------------------------------------------------------------------------------
// 
// GenAI pipelines me static bahut useful hota hai:
// 
// class Logger {
//   static log(msg) {
//     console.log(`[${new Date().toISOString()}]: ${msg}`);
//   }
// }
// Logger.log("Hello World");
// 
// Prompt cleaner
// Embedding utilities
// File path helper
// AI agent ID generator
// 
// Summary
// 
// Static method = class-level function
// Call = ClassName.method()
// Object = Not required
// Use cases = Utility helpers, global operations, logging, formatting, math, timestamps.
// ----------------------------------------------
class Utils {
  static timestamp() {
    return new Date().toISOString();
  }
}

console.log(Utils.timestamp());
