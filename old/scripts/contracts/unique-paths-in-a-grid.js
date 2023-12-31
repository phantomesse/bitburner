/**
 * Unique Paths in a Grid I
 *
 * You are in a grid with N rows and M columns, and you are positioned in the
 * top-left corner of that grid. You are trying to reach the bottom-right corner
 * of the grid, but you can only move down or right on each step. Determine how
 * many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an array with the number of rows
 * and columns.
 *
 * @param {number[]} input array representing number of rows and columns
 * @returns {number} number of unique paths
 */
export function uniquePathsInAGridI(input) {
  const rowCount = input[0];
  const columnCount = input[1];
  const grid = Array(columnCount).fill(Array(rowCount).fill(0));
  return _getUniquePathCount(grid);
}

/**
 * Unique Paths in a Grid II
 *
 * @param {number[][]} input grid
 * @returns {number} number of unique paths
 */
export const uniquePathsInAGridII = _getUniquePathCount;

/**
 * String that is the Object {x: x, y: y} stringified.
 *
 * @typedef {string} Coordinates
 */

/**
 * String containing of only 'D' and 'R' where 'D' represents moving down and
 * 'R' represents moving right.
 *
 * @typedef {string} Path
 */

/**
 * @param {number[][]} grid
 * @returns {number} number of unique paths
 */
function _getUniquePathCount(grid) {
  /** @type {Object.<Coordinates, Path[]>} */
  const coordinatesToUniquePathsMap = {};

  const columnCount = grid.length;
  const rowCount = grid[0].length;
  for (let y = columnCount - 1; y >= 0; y--) {
    for (let x = rowCount - 1; x >= 0; x--) {
      const coordinates = JSON.stringify({ x: x, y: y });
      const uniquePaths = _getUniquePaths(
        x,
        y,
        grid,
        coordinatesToUniquePathsMap
      );
      coordinatesToUniquePathsMap[coordinates] = uniquePaths;
    }
  }

  return coordinatesToUniquePathsMap[JSON.stringify({ x: 0, y: 0 })].length;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} grid
 * @param {Object.<Coordinates, Path[]>} coordinatesToUniquePathsMap
 * @returns {Path[]}
 */
function _getUniquePaths(x, y, grid, coordinatesToUniquePathsMap) {
  if (y === grid.length - 1 && x === grid[0].length - 1) return [''];

  const allPaths = [];

  // Get paths if we moved right.
  if (_canMoveRight(x, y, grid)) {
    const coordinate = JSON.stringify({ x: x + 1, y: y });
    if (coordinate in coordinatesToUniquePathsMap) {
      const paths = coordinatesToUniquePathsMap[coordinate].map(
        (/** @type {Path} */ path) => 'R' + path
      );
      for (const path of paths) allPaths.push(path);
    }
  }

  // Get paths if we moved down.
  if (_canMoveDown(x, y, grid)) {
    const coordinate = JSON.stringify({ x: x, y: y + 1 });
    if (coordinate in coordinatesToUniquePathsMap) {
      const paths = coordinatesToUniquePathsMap[coordinate].map(
        (/** @type {Path} */ path) => 'D' + path
      );
      for (const path of paths) allPaths.push(path);
    }
  }

  return allPaths;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} grid
 * @returns {boolean} true if we can move, false if we cannot move
 */
function _canMoveRight(x, y, grid) {
  if (x + 1 === grid[0].length) return false;
  if (grid[y][x + 1] === 1) return false;
  return true;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} grid
 * @returns {boolean} true if we can move, false if we cannot move
 */
function _canMoveDown(x, y, grid) {
  if (y + 1 === grid.length) return false;
  if (grid[y + 1][x] === 1) return false;
  return true;
}
