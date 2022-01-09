import { uniquePathsInAGridI } from '../scripts/contracts/unique-paths-in-a-grid';
import { runTests } from './utils';

const testCases = [
  { input: [7, 11], output: 8008 },
  { input: [10, 5], output: 715 },
  { input: [14, 10], output: 497420 },
  { input: [10, 2], output: 10 },
  { input: [2, 14], output: 14 },
];
runTests(testCases, uniquePathsInAGridI);
