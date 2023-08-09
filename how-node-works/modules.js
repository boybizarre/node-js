console.log(arguments);
console.log(require('module').wrapper);

// wrapper function
// ['(function (exports, require, module, __filename, __dirname) { ', '\n});'];

// using module.exports
const Calculator = require('./test-module');

const calc1 = new Calculator();
console.log(calc1.add(2, 5));

// using exports
const { add, multiply} = require('./test-module2');
console.log(add(2, 5));

// caching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();
