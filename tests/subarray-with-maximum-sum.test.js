import { subarrayWithMaximumSum } from '../scripts/contracts/subarray-with-maximum-sum';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      3, 2, -10, 3, 9, 6, 6, 4, 3, 7, -3, 5, 9, -5, 5, 3, 5, -3, 10, 7, -2, 8,
      0, -4, -5, -1, -3, -8, 9, -2, 9, 4, -5, 9, -2, 7,
    ],
    output: 85,
  },
  { input: [5, 10, 2, -6, 8, 6, 4, -8, -7, -3, 6, 7, -9, -1], output: 29 },
  {
    input: [-4, 9, -7, 6, 7, -3, 2, -10, -7, -5, 8, -9, -7, -1, -4, 1, -1],
    output: 15,
  },
  {
    input: [
      5, 2, 1, 0, -2, -6, -4, -1, 0, -7, 7, -7, -5, 5, 2, -6, 7, 10, -6, 6, -7,
      1, -5, -9, 3, 5, 0, 8, -3, -5,
    ],
    output: 18,
  },
  { input: [-9, -9, 2, 5, 1, -8, 6, -6, 5, 3], output: 8 },
  {
    input: [
      4, 2, -9, 1, 2, -5, -6, -9, 10, -8, 8, 4, 0, -9, -8, 10, -2, 4, 6, 3, -3,
      1, -9, 1, -5,
    ],
    output: 21,
  },
  { input: [10, -10, -9, -6, 8, 1, 7, 3, 2, 8, -6, 10], output: 33 },
  {
    input: [8, 6, -9, 0, -4, 0, 6, -3, -9, 5, -1, 8, -3, 6, -4, -6, 6, 4, 7, 2],
    output: 24,
  },
];
runTests(testCases, subarrayWithMaximumSum);
