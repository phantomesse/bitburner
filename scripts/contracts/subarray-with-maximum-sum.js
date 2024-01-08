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
 * @returns {number[]} subarray
 */
export default function subarrayWithMaximumSum(array) {
  return getMaxSumSubarray(array);
}

/**
 * @param {number[]} array
 * @returns {number[]}
 */
function getMaxSumSubarray(array) {
  if (array.length === 1) return array;

  if (array.length === 2) {
    return determineMaxSumSubarray(array.slice(0, 1), array.slice(1), array);
  }

  const maxSumSubarray = getMaxSumSubarray(array.slice(1));
}

/**
 * @param  {...number[]} subarrays
 * @returns {number[]} subarray with max sum
 */
function determineMaxSumSubarray(...subarrays) {
  console.log(`comparing ${subarrays.join('\n')}`);
  let maxSum, maxSumSubarray;
  for (const subarray of subarrays) {
    const sum = subarray.reduce((a, b) => a + b);
    if (maxSum === undefined || sum > maxSum) {
      maxSum = sum;
      maxSumSubarray = subarray;
    }
  }
  return maxSumSubarray;
}

console.log(subarrayWithMaximumSum([10, 6]));
