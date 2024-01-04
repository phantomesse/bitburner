import uniquePathsInAGridI from 'contracts/unique-paths-in-a-grid-i';
import runTests from 'run-tests';

const testCases = [
  { input: [6, 2], output: 6 },
  { input: [9, 9], output: 12870 },
];

runTests(testCases, uniquePathsInAGridI);
