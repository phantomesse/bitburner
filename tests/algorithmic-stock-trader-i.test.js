import algorithmicStockTraderI from 'contracts/algorithmic-stock-trader-i';
import runTests from 'run-tests';

const testCases = [
  {
    input: [
      35, 172, 130, 31, 111, 79, 19, 41, 125, 183, 11, 39, 153, 11, 19, 126,
      130, 22, 139, 134, 54, 47, 169, 138, 75,
    ],
    output: 164,
  },
];

runTests(testCases, algorithmicStockTraderI);
