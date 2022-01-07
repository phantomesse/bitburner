import { uniquePathsInAGridI } from '../scripts/contracts/unique-paths-in-a-grid-i';
import { runTests } from './utils';

const testCases = [
  { input: [7, 11], output: 8008 },
  { input: [10, 5], output: 715 },
  { input: [14, 10], output: 497420 },
];
runTests(testCases, uniquePathsInAGridI);
