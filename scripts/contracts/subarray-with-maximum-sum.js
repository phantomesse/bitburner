/**
 * Subarray with Maximum Sum
 *
 * Given the following integer array, find the contiguous subarray (containing
 * at least one number) which has the largest sum and return that sum. 'Sum'
 * refers to the sum of all the numbers in the subarray.
 *
 * @param {int[]} input
 */
export function subarrayWithMaximumSum(input) {
  let maxSum;
  for (let startIndex = 0; startIndex < input.length - 1; startIndex++) {
    for (let endIndex = startIndex + 1; endIndex < input.length; endIndex++) {
      const subarray = input.slice(startIndex, endIndex);
      const sum = subarray.reduce((a, b) => a + b);
      if (maxSum === undefined || sum > maxSum) maxSum = sum;
    }
  }
  return maxSum;
}
