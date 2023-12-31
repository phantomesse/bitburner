import { findLargestPrimeFactor } from '../scripts/contracts/find-largest-prime-factor';
import { runTests } from './utils';

const testCases = [
  { input: 785484550, output: 234473 },
  { input: 777986532, output: 2423 },
  { input: 166934276, output: 1399 },
  { input: 129829481, output: 25847 },
  { input: 862536428, output: 16587239 },
  { input: 1596174, output: 266029 },
  { input: 395033078, output: 17956049 },
];
runTests(testCases, findLargestPrimeFactor);
