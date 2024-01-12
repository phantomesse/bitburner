/**
 * Subarray with Maximum Sum
 *
 * Given the following integer array, find the contiguous subarray (containing
 * at least one number) which has the largest sum and return that sum. 'Sum'
 * refers to the sum of all the numbers in the subarray.
 *
 * 9,-10,-5,3,-1,7,-3,8,5,9,5,-6,-5,-7,4,3,-4,-6,3,-7,10,-6,3,3,1,1,10,0,-8,2,3,-2,1
 *
 * @param {number[]} array
 * @returns {number} sum
 */
export default function subarrayWithMaximumSum(array) {
  let maxSum;
  for (let startIndex = 0; startIndex < array.length; startIndex++) {
    for (let endIndex = array.length; endIndex > startIndex; endIndex--) {
      const subarray = array.slice(startIndex, endIndex);
      const sum = subarray.reduce((a, b) => a + b, 0);
      if (!maxSum || sum > maxSum) maxSum = sum;
    }
  }
  return maxSum;
}
