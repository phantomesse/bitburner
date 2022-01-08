import { totalWaysToSum } from '../scripts/contracts/total-ways-to-sum';
import { runTests } from './utils';

const testCases = [
  { input: 4, output: 4 },
  { input: 23, output: 1254 },
  { input: 70, output: 4087967 },
];
runTests(testCases, totalWaysToSum);
