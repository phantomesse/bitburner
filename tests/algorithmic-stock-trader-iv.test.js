import { algorithmicStockTraderIV } from '../scripts/contracts/algorithmic-stock-trader.js';
import { runTests } from './utils.js';

const testCases = [
  {
    input: [
      6,
      [
        101, 22, 191, 49, 3, 21, 93, 155, 120, 49, 48, 34, 193, 52, 179, 89, 77,
        98, 34, 189, 195, 71, 175, 90, 40, 134, 98, 46, 91, 152, 2, 103, 174,
        126, 82, 179, 172, 56, 145, 113, 165, 101, 162, 55, 16, 164, 111,
      ],
    ],
    output: 972,
  },
];
runTests(testCases, algorithmicStockTraderIV);
