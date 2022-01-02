import { getUniquePaths } from '/contracts/unique-paths-in-a-grid-ii.js';

/**
 * Unique Paths in a Grid I
 *
 * You are in a grid with 9 rows and 14 columns, and you are positioned in the
 * top-left corner of that grid. You are trying to reach the bottom-right corner
 * of the grid, but you can only move down or right on each step. Determine how
 * many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an array with the number of rows
 * and columns: [9, 14]
 *
 * @param {int[]} input
 */
export function uniquePathsInAGridI(input) {
  const matrix = new Array(input[1]).fill(new Array(input[0]).fill(0));
  return new Set(getUniquePaths(matrix, 0, 0, '')).size;
}
