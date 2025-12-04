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

/*
----------------------------------------------
What Is Happening?
----------------------------------------------

- operate is a higher-order function.
- It takes another function as input (operationFn).
- It calls that function with a given value.

sq is a normal arrow function that squares a number.

You pass sq into operate.
operate then executes sq(4).

Output becomes 16.
----------------------------------------------
 */

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
