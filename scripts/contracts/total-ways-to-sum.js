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
  return _getWaysToSum(input).length;
}

const cachedWaysToSum = { 1: [] };

/**
 * @param {int} number
 * @param {int[]} addends
 * @returns {int[][]} a list of different ways to sum
 *                    (e.g. [[3, 1], [2, 2], ...])
 */
function _getWaysToSum(number) {
  if (number in cachedWaysToSum) return cachedWaysToSum[number];
  let ways = [];
  for (let addend = number - 1; addend > 0; addend--) {
    ways.push([addend, number - addend]);
    const waysToSum = _getWaysToSum(number - addend).map(way => [
      addend,
      ...way,
    ]);
    ways.push(...waysToSum);
  }
  const waysToSum = [...new Set(ways.map(way => way.sort().join(' ')))].map(
    way => way.split(' ').map(number => parseInt(number))
  );
  cachedWaysToSum[number] = waysToSum;
  return waysToSum;
}
