import { findLargestPrimeFactor } from '../scripts/contracts/find-largest-prime-factor';
import { runTests } from './utils';

const testCases = [
  { input: 785484550, output: 234473 },
  { input: 777986532, output: 2423 },
];
runTests(testCases, findLargestPrimeFactor);
