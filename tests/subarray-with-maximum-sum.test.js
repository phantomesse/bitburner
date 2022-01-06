import { subarrayWithMaximumSum } from '../scripts/contracts/subarray-with-maximum-sum.js';
import { runTests } from './utils.js';

const testCases = [
  {
    input: [
      3, 2, -10, 3, 9, 6, 6, 4, 3, 7, -3, 5, 9, -5, 5, 3, 5, -3, 10, 7, -2, 8,
      0, -4, -5, -1, -3, -8, 9, -2, 9, 4, -5, 9, -2, 7,
    ],
    output: 85,
  },
];
runTests(testCases, subarrayWithMaximumSum);
