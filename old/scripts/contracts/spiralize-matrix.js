/**
 * Spiralize Matrix
 *
 * Given the following array of arrays of numbers representing a 2D matrix,
 * return the elements of the matrix as an array in spiral order
 *
 * @param {number[][]} input
 * @returns {number[]}
 */
export function spiralizeMatrix(input) {
  const visitedMatrix = Array.from({ length: input.length }, () =>
    Array(input[0].length).fill(false)
  );
  return _getPath(input, visitedMatrix, 0, 0, Direction.RIGHT, []);
}

/**
 * @typedef {number} Direction
 */

/**
 * @readonly
 * @enum {Direction}
 */
const Direction = Object.freeze({
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
});

/**
 * @param {number[][]} matrix
 * @param {boolean[][]} visitedMatrix copy of matrix for marking which cells we've visited
 * @param {number} currentX
 * @param {number} currentY
 * @param {Direction} currentDirection
 * @param {number[]} pathThusFar
 */
function _getPath(
  matrix,
  visitedMatrix,
  currentX,
  currentY,
  currentDirection,
  pathThusFar
) {
  pathThusFar.push(matrix[currentY][currentX]);
  visitedMatrix[currentY][currentX] = true;

  // Check if we have visited all cells.
  if (_visitedAll(visitedMatrix)) return pathThusFar;

  const nextDirection = _getNextDirection(
    visitedMatrix,
    currentX,
    currentY,
    currentDirection
  );
  return _getPath(
    matrix,
    visitedMatrix,
    _getNextX(currentX, nextDirection),
    _getNextY(currentY, nextDirection),
    nextDirection,
    pathThusFar
  );
}

function _getNextDirection(
  visitedMatrix,
  currentX,
  currentY,
  currentDirection
) {
  if (_canMove(visitedMatrix, currentX, currentY, currentDirection)) {
    return currentDirection;
  }
  return (currentDirection + 1) % Object.keys(Direction).length;
}

function _canMove(visitedMatrix, currentX, currentY, nextDirection) {
  const x = _getNextX(currentX, nextDirection);
  const y = _getNextY(currentY, nextDirection);
  if (x < 0 || x >= visitedMatrix[0].length) return false;
  if (y < 0 || y >= visitedMatrix.length) return false;
  return !visitedMatrix[y][x];
}

function _getNextX(currentX, nextDirection) {
  if (nextDirection === Direction.LEFT) return currentX - 1;
  if (nextDirection === Direction.RIGHT) return currentX + 1;
  return currentX;
}

function _getNextY(currentY, nextDirection) {
  if (nextDirection === Direction.UP) return currentY - 1;
  if (nextDirection === Direction.DOWN) return currentY + 1;
  return currentY;
}

function _visitedAll(visitedMatrix) {
  for (let y = 0; y < visitedMatrix.length; y++) {
    for (let x = 0; x < visitedMatrix[y].length; x++) {
      if (!visitedMatrix[y][x]) return false;
    }
  }
  return true;
}
