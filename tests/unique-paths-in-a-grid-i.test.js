import { uniquePathsInAGridI } from '../scripts/contracts/unique-paths-in-a-grid';
import { runTests } from './utils';

const testCases = [
  { input: [7, 11], output: 8008 },
  { input: [10, 5], output: 715 },
];
runTests(testCases, uniquePathsInAGridI);
