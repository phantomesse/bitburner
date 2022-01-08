import { minimumPathSumInATriangle } from '../scripts/contracts/minimum-path-sum-in-a-triangle';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      [6],
      [5, 4],
      [5, 1, 5],
      [4, 4, 9, 6],
      [4, 4, 3, 3, 9],
      [3, 5, 7, 3, 7, 8],
      [1, 3, 4, 8, 7, 5, 6],
      [3, 6, 2, 1, 3, 2, 4, 9],
      [6, 8, 2, 7, 5, 8, 6, 9, 8],
      [5, 2, 1, 6, 5, 8, 8, 3, 3, 4],
    ],
    output: 32,
  },
  {
    input: [
      [9],
      [5, 5],
      [8, 3, 6],
      [8, 6, 9, 1],
      [7, 6, 4, 1, 7],
      [8, 1, 2, 7, 9, 4],
      [8, 1, 5, 2, 5, 1, 5],
      [4, 6, 8, 3, 4, 6, 2, 8],
    ],
    output: 34,
  },
  {
    input: [
      [3],
      [4, 7],
      [3, 5, 2],
      [4, 8, 5, 1],
      [3, 5, 1, 5, 9],
      [8, 5, 5, 3, 7, 8],
    ],
    output: 21,
  },
  {
    input: [
      [5],
      [5, 1],
      [1, 4, 5],
      [1, 8, 9, 6],
      [6, 7, 3, 7, 8],
      [7, 7, 4, 5, 3, 5],
      [4, 7, 5, 9, 8, 3, 8],
      [1, 4, 4, 6, 7, 4, 2, 5],
      [8, 5, 5, 8, 5, 1, 2, 2, 6],
      [9, 2, 3, 8, 5, 7, 9, 2, 6, 1],
      [3, 7, 7, 5, 5, 3, 4, 4, 8, 3, 5],
    ],
    output: 40,
  },
];
runTests(testCases, minimumPathSumInATriangle);
