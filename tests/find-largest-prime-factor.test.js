import { findLargestPrimeFactor } from '../scripts/contracts/find-largest-prime-factor';
import { runTests } from './utils';

const testCases = [{ input: 785484550, output: 234473 }];
runTests(testCases, findLargestPrimeFactor);
