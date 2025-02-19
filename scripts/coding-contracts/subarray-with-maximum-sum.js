/**
 * Subarray with Maximum Sum
 *
 * Given the following integer array, find the contiguous subarray (containing
 * at least one number) which has the largest sum and return that sum. 'Sum'
 * refers to the sum of all the numbers in the subarray.
 *
 * -9,3,2,-6,-5,-5,0,-2,-7,3,6,7,-5,2,-10,5,-9,-9,-4,10,-2,-3,2
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveSubarrayWithMaximumSum(input) {
  let maxSum;
  for (let startIndex = 0; startIndex < input.length - 1; startIndex++) {
    let sum = input[startIndex];
    for (let endIndex = startIndex + 1; endIndex < input.length; endIndex++) {
      sum += input[endIndex];
      if (maxSum === undefined || sum > maxSum) maxSum = sum;
    }
  }
  return maxSum;
}
