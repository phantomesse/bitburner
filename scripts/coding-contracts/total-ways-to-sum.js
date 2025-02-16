// Total Ways to Sum
//
// It is possible write four as a sum in exactly four different ways:
//
//     3 + 1
//     2 + 2
//     2 + 1 + 1
//     1 + 1 + 1 + 1
//
// How many different distinct ways can the number 11 be written as a sum of at
// least two positive integers?

/**
 * @param {number} input
 * @returns {number}
 */
export function solveTotalWaysToSum(input) {
  return getTotalWaysToSum(input);
}

/**
 * @param {number} number
 * @returns {number} total ways to sum
 */
function getTotalWaysToSum(number) {
  if (number === 1) return 0;
  if (number === 2) return 1;

  let waysToSum = 0;
  for (let i = 1; i < number; i++) {
    waysToSum += getTotalWaysToSum(i);
  }
  return waysToSum;
}

console.log(solveTotalWaysToSum(4));
console.log(solveTotalWaysToSum(11));
