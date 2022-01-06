import { algorithmicStockTraderIII } from '../scripts/contracts/algorithmic-stock-trader.js';
import { runTests } from './utils.js';

const testCases = [
  {
    input: [
      16, 171, 74, 18, 34, 182, 173, 19, 128, 36, 43, 124, 27, 163, 69, 154, 34,
      92, 72, 152, 142, 90, 200,
    ],
    output: 347,
  },
];
runTests(testCases, algorithmicStockTraderIII);
