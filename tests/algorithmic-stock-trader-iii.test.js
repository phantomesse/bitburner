import algorithmicStockTraderIII from 'contracts/algorithmic-stock-trader-iii';
import runTests from 'run-tests';

const testCases = [
  {
    input: [
      125, 184, 186, 49, 96, 29, 47, 152, 111, 59, 12, 14, 169, 178, 50, 178,
      64, 2, 192, 104, 124, 190, 48, 188, 174, 188, 135, 34,
    ],
    output: 356,
  },
];

runTests(testCases, algorithmicStockTraderIII);
