/**
 * Minimum Path Sum in a Triangle
 *
 * Given a triangle, find the minimum path sum from top to bottom. In each step
 * of the path, you may only move to adjacent numbers in the row below. The
 * triangle is represented as a 2D array of numbers:
 *
 * [
 *            [9],
 *           [2,9],
 *          [6,9,7],
 *         [1,1,4,4],
 *        [5,3,9,8,8],
 *       [4,4,6,4,5,2],
 *      [5,3,4,4,3,1,2],
 *     [4,1,7,4,2,1,2,2],
 *    [6,9,6,8,2,5,5,6,1],
 *   [9,5,7,7,3,4,5,9,3,2]
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
 * @returns {number}
 */
export function solveMinimumPathSumInATriangle(input) {
  /** @type {Node[][]} */ const nodes = [];
  for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
    const currentRowNodes = input[rowIndex].map((value) => new Node(value));
    nodes.push(currentRowNodes);

    if (rowIndex > 0) {
      const prevRowNodes = nodes[rowIndex - 1];
      let currentRowNodeIndex = 0;
      for (const prevRowNode of prevRowNodes) {
        prevRowNode.left = currentRowNodes[currentRowNodeIndex];
        prevRowNode.right = currentRowNodes[currentRowNodeIndex + 1];
        currentRowNodeIndex++;
      }
    }
  }

  return getMinimumPathSum(nodes[0][0]);
}

function getMinimumPathSum(rootNode) {
  if (rootNode.left === null && rootNode.right === null) return rootNode.value;
  return Math.min(
    rootNode.value + getMinimumPathSum(rootNode.left),
    rootNode.value + getMinimumPathSum(rootNode.right)
  );
}

class Node {
  /** @param {number} value */
  constructor(value) {
    /** @type {number} */ this.value = value;
    /** @type {Node} */ this.left = null;
    /** @type {Node} */ this.right = null;
  }
}
