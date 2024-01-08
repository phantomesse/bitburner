/**
 * Spiralize Matrix
 *
 * Given the following array of arrays of numbers representing a 2D matrix,
 * return the elements of the matrix as an array in spiral order:
 *
 *     [
 *         [25,20,16, 5,39,24,15,41,12,13,27,10]
 *         [44,26,34,22,19,39,20,28,37,34,43,24]
 *         [34, 1, 7,36,43,37,44,44, 5,36,49, 7]
 *         [ 7,24,41,41, 3,44,20,50,31, 6, 9,15]
 *         [36,13,47,41, 7,41,23, 2, 4,45,40,12]
 *         [31,43,21,14,30,47,14, 6,43,49,25,12]
 *         [47,40,25,46,13,39,41,48,46,45,34,25]
 *         [22,26,29,24,24,38,40,30,13,38,34,46]
 *         [47,34,17,16,36,16,24,27,16,50,13, 9]
 *         [10,10,13,26,14,17,36,14,49,50,25,11]
 *         [11,49, 7,25,43, 9, 2,42, 7,12,25,25]
 *         [25,16,24,17,31,31,45,22, 9, 7,35,39]
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
 * @param {number[][]} matrix
 * @returns {number[]}
 */
export default function spiralizeMatrix(matrix) {
  const elements = [];
  const totalElementCount = matrix.length * matrix[0].length;

  let [x, y] = [0, 0];
  let direction = Direction.Right;
  do {
    if (isValidPosition(x, y, matrix)) {
      elements.push(matrix[y][x]);
      matrix[y][x] = null;
    }

    switch (direction) {
      case Direction.Right:
        if (isValidPosition(x + 1, y, matrix)) {
          x++;
        } else {
          direction = Direction.Down;
        }
        break;
      case Direction.Down:
        if (isValidPosition(x, y + 1, matrix)) {
          y++;
        } else {
          direction = Direction.Left;
        }
        break;
      case Direction.Left:
        if (isValidPosition(x - 1, y, matrix)) {
          x--;
        } else {
          direction = Direction.Up;
        }
        break;
      case Direction.Up:
        if (isValidPosition(x, y - 1, matrix)) {
          y--;
        } else {
          direction = Direction.Right;
        }
        break;
    }
  } while (elements.length < totalElementCount);

  return elements;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} matrix
 * @returns
 */
function isValidPosition(x, y, matrix) {
  return (
    x >= 0 &&
    y >= 0 &&
    y < matrix.length &&
    x < matrix[y].length &&
    matrix[y][x] !== null
  );
}

const Direction = Object.freeze({
  Right: Symbol('Right'),
  Down: Symbol('Down'),
  Left: Symbol('Left'),
  Up: Symbol('Up'),
});
