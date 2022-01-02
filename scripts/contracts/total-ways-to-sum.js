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
 * @param {int} input
 * @returns {int} number of ways to sum
 */
export function totalWaysToSum(input) {
  const dynamicProgramming = new Array(input + 1).fill(0);
  dynamicProgramming[0] = 1;

  for (let i = 1; i < input; i++) {
    for (let j = 1; j < input + 1; j++) {
      if (j >= i) {
        dynamicProgramming[j] =
          dynamicProgramming[j] + dynamicProgramming[j - i];
      }
    }
  }

  return dynamicProgramming[input];
}
