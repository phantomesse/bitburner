import { algorithmicStockTraderII } from '../scripts/contracts/algorithmic-stock-trader';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      169, 149, 94, 85, 133, 175, 120, 34, 38, 60, 86, 18, 13, 83, 16, 7, 57,
      170,
    ],
    output: 375,
  },
  { input: [175, 19, 129, 66, 85, 140, 78], output: 184 },
  {
    input: [136, 57, 103, 30, 87, 123, 19, 189, 125, 150, 57, 3, 141],
    output: 472,
  },
  {
    input: [
      144, 38, 57, 28, 71, 170, 28, 168, 91, 42, 85, 168, 87, 41, 46, 47, 16,
      26, 113,
    ],
    output: 530,
  },
];
runTests(testCases, algorithmicStockTraderII);
