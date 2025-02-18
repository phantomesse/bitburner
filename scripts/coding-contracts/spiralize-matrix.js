/**
 * Spiralize Matrix
 *
 * Given the following array of arrays of numbers representing a 2D matrix,
 * return the elements of the matrix as an array in spiral order:
 *
 *     [
 *         [ 9,21,27,49]
 *     ]
 *
 * Here is an example of what spiral order should be:
 *
 *     [
 *         [1, 2, 3]
 *         [4, 5, 6]
 *         [7, 8, 9]
 *     ]
 *
 * Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]
 *
 * Note that the matrix will not always be square:
 *
 *     [
 *         [1,  2,  3,  4]
 *         [5,  6,  7,  8]
 *         [9, 10, 11, 12]
 *     ]
 *
 * Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
 *
 * @param {number[][]} input
 * @returns {number[]}
 */
export function solveSpiralizeMatrix(input) {
  const visitedMatrix = Array(input.length);
  for (let i = 0; i < input.length; i++) {
    visitedMatrix[i] = Array(input[i].length);
    for (let j = 0; j < input[i].length; j++) {
      visitedMatrix[i][j] = false;
    }
  }

  const elements = [];
  const totalLength = input.length * input[0].length;

  let coords = { x: 0, y: 0 };
  let direction = DIRECTIONS[0];
  while (elements.length < totalLength) {
    elements.push(input[coords.y][coords.x]);
    visitedMatrix[coords.y][coords.x] = true;

    let newCoords = getNewCoords(coords, direction);
    if (!isValid(newCoords, visitedMatrix)) {
      // Invalid move, so switch direction.
      direction =
        DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % DIRECTIONS.length];
      newCoords = getNewCoords(coords, direction);
    }
    coords = newCoords;
  }

  return elements;
}

const DIRECTIONS = ['R', 'D', 'L', 'U'];

/**
 * @param {{x: number, y: number}} coords
 * @param {'R'|'D'|'L'|'U'} direction
 * @returns {{x: number, y: number}}
 */
function getNewCoords(coords, direction) {
  const x = coords.x;
  const y = coords.y;

  switch (direction) {
    case 'R':
      return { x: x + 1, y };
    case 'D':
      return { x, y: y + 1 };
    case 'L':
      return { x: x - 1, y };
    case 'U':
      return { x, y: y - 1 };
  }
}

/**
 *
 * @param {{x: number, y: number}} coords
 * @param {boolean[][]} visitedMatrix
 * @returns {boolean}
 */
function isValid(coords, visitedMatrix) {
  const x = coords.x;
  const y = coords.y;
  if (x < 0 || y < 0) return false;
  if (y >= visitedMatrix.length || x >= visitedMatrix[y].length) return false;
  return !visitedMatrix[y][x];
}
