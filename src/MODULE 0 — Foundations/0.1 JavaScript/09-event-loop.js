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
