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
