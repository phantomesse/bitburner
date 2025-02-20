/**
 * Total Ways to Sum
 *
 * It is possible write four as a sum in exactly four different ways:
 *
 *     3 + 1
 *     2 + 2
 *     2 + 1 + 1
 *     1 + 1 + 1 + 1
 *
 * How many different distinct ways can the number 11 be written as a sum of at
 * least two positive integers?
 *
 * @param {number} input
 * @returns {number}
 */
export function solveTotalWaysToSum(input) {
  if (input > 30) {
    // Will take too long to execute;
    return null;
  }

  const target = input;
  const numbers = [...Array(target).keys()].slice(1);
  const waysToSum = getWaysToSum(target, numbers);
  return waysToSum.length;
}

/**
 * Total Ways to Sum II
 *
 * How many different distinct ways can the number 170 be written as a sum of
 * integers contained in the set:
 *
 * [1,3,10,12,16,18,19,21,23,24,25]?
 *
 * You may use each integer in the set zero or more times.
 *
 * @param {[number, number[]]} input
 * @returns {number}
 */
export function solveTotalWaysToSumII(input) {
  const [target, numbers] = input;
  numbers.sort((a, b) => b - a);

  const waysToSum = getWaysToSum(target, numbers);
  console.log(waysToSum);
}

/**
 * @param {number} target
 * @param {number[]} numbers
 * @param {WayToSum} [wayToSumThusFar]
 * @returns {WayToSum[]} list of ways to sum
 */
function getWaysToSum(target, numbers, wayToSumThusFar = new WayToSum()) {
  const sum = wayToSumThusFar.getSum();
  if (sum > target) return [];
  if (sum === target) {
    return [wayToSumThusFar];
  }

  const prevLength = numbers.length;
  numbers = numbers.filter((number) => number <= target - sum);
  if (numbers.length === 0) return [];

  const firstNumber = numbers[0];

  const waysToSum = [];
  for (let multiplier = 0; multiplier <= target / firstNumber; multiplier++) {
    const newWayToSum = new WayToSum({
      ...wayToSumThusFar.numberToMultiplierMap,
      [firstNumber]: multiplier,
    });
    waysToSum.push(...getWaysToSum(target, numbers.slice(1), newWayToSum));
  }
  return waysToSum;
}

class WayToSum {
  /**
   * @param {Object<number, number> = {}} numberToMultiplierMap
   */
  constructor(numberToMultiplierMap = {}) {
    /** @type {Object<number, number>}*/ this.numberToMultiplierMap =
      numberToMultiplierMap;
  }

  getSum() {
    const products = Object.entries(this.numberToMultiplierMap).map(
      ([number, multiplier]) => number * multiplier
    );
    return products.length === 0 ? 0 : products.reduce((a, b) => a + b);
  }

  toString() {
    return (
      Object.entries(this.numberToMultiplierMap)
        .filter(([_, multiplier]) => multiplier > 0)
        .map(([number, multiplier]) => `${number}*${multiplier}`)
        .join(' + ') +
      ' = ' +
      this.getSum()
    );
  }
}

// console.log(solveTotalWaysToSum(30));

// console.log(
//   solveTotalWaysToSumII([170, [1, 3, 10, 12, 16, 18, 19, 21, 23, 24, 25]])
// );
