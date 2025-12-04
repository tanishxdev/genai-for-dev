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
