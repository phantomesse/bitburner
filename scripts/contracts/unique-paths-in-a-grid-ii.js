/**
 * Unique Paths in a Grid II
 *
 * You are located in the top-left corner of a grid.
 *
 * You are trying reach the bottom-right corner of the grid, but you can only
 * move down or right on each step. Furthermore, there are obstacles on the grid
 * that you cannot move onto. These obstacles are denoted by '1', while empty
 * spaces are denoted by 0.
 *
 * Determine how many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an 2D array of numbers
 * representing the grid.
 *
 * @param {int[][]} input
 */
export function uniquePathsInAGridII(input) {
  return new Set(getUniquePaths(input, 0, 0, '')).size;
}

/**
 * @param {int[][]} grid
 * @param {int} startX
 * @param {int} startY
 * @returns {string[]} list of instructions (e.g. "DDRR")
 */
export function getUniquePaths(grid, startX, startY, instructionsThusFar) {
  if (startX === grid[0].length - 1 && startY === grid.length - 1) {
    return [instructionsThusFar];
  }
  const allInstructions = [];
  if (_canMoveRight(grid, startX, startY)) {
    allInstructions.push(
      ...getUniquePaths(grid, startX + 1, startY, instructionsThusFar + 'R')
    );
  }
  if (_canMoveDown(grid, startX, startY)) {
    allInstructions.push(
      ...getUniquePaths(grid, startX, startY + 1, instructionsThusFar + 'D')
    );
  }
  return allInstructions;
}

function _canMoveRight(grid, x, y) {
  if (x + 1 === grid[0].length) return false;
  if (grid[y][x + 1] === 1) return false;
  return true;
}

function _canMoveDown(grid, x, y) {
  if (y + 1 === grid.length) return false;
  if (grid[y + 1][x] === 1) return false;
  return true;
}
