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
