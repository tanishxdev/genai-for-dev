// Importing named exports
import { PI, add } from "./05-es-modules-math.js";

// Importing default export
import greet from "./05-es-modules-greet.js";

console.log("PI =", PI);
console.log("Add =", add(10, 20));
console.log(greet("Tanish"));
