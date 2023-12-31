/**
 * Total Ways to Sum
 *
 * It is possible write four as a sum in exactly four different ways:
 *
 *  3 + 1
 *  2 + 2
 *  2 + 1 + 1
 *  1 + 1 + 1 + 1
 *
 * How many different ways can the input number be written as a sum of at least
 * two positive integers?
 *
 * @param {number} input
 * @returns {number} number of ways to sum
 */
export function totalWaysToSum(input) {
  const waysToSum = new Array(input + 1).fill(0);
  waysToSum[0] = 1;

  for (let i = 1; i < input; i++) {
    for (let j = i; j < input + 1; j++) {
      waysToSum[j] = waysToSum[j] + waysToSum[j - i];
    }
  }

  return waysToSum[input];
}
