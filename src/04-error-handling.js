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
