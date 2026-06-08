// calculator.js — small arithmetic helpers.
// NOTE: intentionally buggy for the Manta demo. Five different kinds of
// problem so triage can assign different priorities, types, and assignees:
//   divide()  crash bug      bug  / p0     average() edge-case bug  bug  / p2
//   add()     logic bug      bug  / p1     square()  wrong comment  docs / p3
//   isEqual() lint warning   task / p4

function add(a, b) {
  return a + b; // string inputs concatenate instead of summing
}

function divide(a, b) {
  return a / b; // no guard for b === 0
}

function average(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) sum += nums[i];
  return sum / nums.length; // empty array -> NaN
}

function isEqual(a, b) {
  return a == b; // loose equality
}

// Returns the cube of n.
function square(n) {
  return n * n; // comment says cube, code squares
}

module.exports = { add, divide, average, isEqual, square };
