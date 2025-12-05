/* 
   Topic: Fetch and Axios (HTTP Requests)
   Purpose: Learn how to call APIs reliably in GenAI projects.
*/

// ----------------------------------------------
// 1. Fetch: Basic GET
// ----------------------------------------------
async function fetchGetExample() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  // Convert response to JS object
  const data = await res.json();
  console.log("Fetch GET:", data);
}

fetchGetExample();


// ----------------------------------------------
// 2. Fetch: Basic POST
// ----------------------------------------------
async function fetchPostExample() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "GenAI", body: "Learning", userId: 1 })
  });

  const data = await res.json();
  console.log("Fetch POST:", data);
}

fetchPostExample();


// ----------------------------------------------
// 3. Axios: Basic GET
// ----------------------------------------------
import axios from "axios";

async function axiosGetExample() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users/1");
  console.log("Axios GET:", res.data);
}

axiosGetExample();


// ----------------------------------------------
// 4. Axios: Basic POST
// ----------------------------------------------
async function axiosPostExample() {
  const res = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title: "GenAI Axios",
      body: "AI engineer",
      userId: 2
    }
  );

  console.log("Axios POST:", res.data);
}

axiosPostExample();


// ----------------------------------------------
// 5. Axios Timeout + Error Handling
// ----------------------------------------------
async function axiosWithTimeout() {
  try {
    const res = await axios.get("https://httpbin.org/delay/3", {
      timeout: 2000 // 2 seconds
    });
    console.log("Axios timeout test:", res.data);

  } catch (err) {
    console.log("Timeout or network error:", err.message);
  }
}

axiosWithTimeout();
