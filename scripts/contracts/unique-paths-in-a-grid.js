export const uniquePathsInAGridII = input => _getUniquePathCount(input);

const _getUniquePathCount = grid =>
  new Set(_getUniquePaths(grid, 0, 0, '')).size;

/**
 * @param {int[][]} grid
 * @param {int} startX
 * @param {int} startY
 * @returns {string[]} list of instructions (e.g. "DDRR")
 */
function _getUniquePaths(grid, startX, startY, instructionsThusFar) {
  if (startX === grid[0].length - 1 && startY === grid.length - 1) {
    return [instructionsThusFar];
  }
  const allInstructions = [];
  if (_canMoveRight(grid, startX, startY)) {
    allInstructions.push(
      ..._getUniquePaths(grid, startX + 1, startY, instructionsThusFar + 'R')
    );
  }
  if (_canMoveDown(grid, startX, startY)) {
    allInstructions.push(
      ..._getUniquePaths(grid, startX, startY + 1, instructionsThusFar + 'D')
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
