import findLargestPrimeFactor from 'contracts/find-largest-prime-factor';
import runTests from 'run-tests';

const testCases = [{ input: 301829830, output: 494803 }];

runTests(testCases, findLargestPrimeFactor);
