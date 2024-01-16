/**
 * Minimum Path Sum in a Triangle
 *
 * Given a triangle, find the minimum path sum from top to bottom. In each step
 * of the path, you may only move to adjacent numbers in the row below. The
 * triangle is represented as a 2D array of numbers:
 *
 * [
 *         [4],
 *        [6,2],
 *       [8,9,1],
 *      [5,3,8,6],
 *     [3,3,6,6,6],
 *    [1,8,9,3,2,4],
 *   [9,4,3,3,9,5,2]
 * ]
 *
 * Example: If you are given the following triangle:
 *
 * [
 *      [2],
 *     [3,4],
 *    [6,5,7],
 *   [4,1,8,3]
 * ]
 *
 * The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
 *
 * @param {number[][]} triangle
 */
export default function minimumPathSumInATriangle(triangle) {
  return getMinimumSum(triangle);
}

/**
 *
 * @param {number[][]} triangle
 * @param {[number]} index
 * @param {[number]} sumThusFar
 * @returns {number} minimum sum
 */
function getMinimumSum(triangle, index, sumThusFar) {
  if (!triangle || triangle.length === 0) return sumThusFar;

  const row = triangle[0];
  if (row.length === 1) {
    return getMinimumSum(triangle.slice(1), 0, row[0]);
  }

  const sumA = getMinimumSum(triangle.slice(1), index, sumThusFar + row[index]);
  const sumB = getMinimumSum(
    triangle.slice(1),
    index + 1,
    sumThusFar + row[index + 1]
  );
  return Math.min(sumA, sumB);
}
