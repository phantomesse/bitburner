/**
 * Minimum Path Sum in a Triangle
 *
 * Given a triangle, find the minimum path sum from top to bottom. In each step
 * of the path, you may only move to adjacent numbers in the row below. The
 * triangle is represented as a 2D array of numbers:
 *
 * [
 *             [5],
 *            [4,5],
 *           [7,4,6],
 *          [9,6,4,3],
 *         [7,4,9,7,8],
 *        [6,2,7,9,4,2],
 *       [5,2,3,8,1,5,1],
 *      [8,4,9,7,1,1,1,2],
 *     [4,8,1,8,1,3,9,8,6],
 *    [7,1,1,7,5,8,3,5,3,6],
 *   [4,6,3,6,4,7,8,5,9,5,8]
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
 * @param {number[][]} input
 */
export function minimumPathSumInATriangle(input) {
  let rootNode = new Node(input, 0, 0);
  return Math.min(
    ..._getPaths(rootNode, '').map(path => path.reduce((a, b) => a + b))
  );
}

function _getPaths(rootNode, pathThusFar) {
  pathThusFar = [...pathThusFar, rootNode.number];
  if (rootNode.nextNodes.length === 0) {
    return [pathThusFar];
  }
  const paths = [];
  for (const nextNode of rootNode.nextNodes) {
    paths.push(..._getPaths(nextNode, pathThusFar));
  }
  return paths;
}

class Node {
  constructor(input, row, column) {
    this.number = input[row][column];
    this.row = row;
    this.column = column;

    if (this.row === input.length - 1) {
      this.nextNodes = [];
    } else {
      this.nextNodes = [
        new Node(input, row + 1, column),
        new Node(input, row + 1, column + 1),
      ];
    }
  }
}
