import totalWaysToSum from 'contracts/total-ways-to-sum';
import runTests from 'run-tests';

const testCases = [
  { input: 4, output: 4 },
  { input: 46, output: 105557 },
  { input: 86, output: 34262961 },
];

runTests(testCases, totalWaysToSum);
