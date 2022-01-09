import { uniquePathsInAGridII } from '../scripts/contracts/unique-paths-in-a-grid';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      [0, 0, 0],
      [0, 0, 0],
      [1, 0, 0],
    ],
    output: 5,
  },
];
runTests(testCases, uniquePathsInAGridII);
