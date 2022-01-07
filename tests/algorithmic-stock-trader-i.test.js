import { algorithmicStockTraderI } from '../scripts/contracts/algorithmic-stock-trader';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      96, 83, 172, 187, 96, 195, 159, 34, 141, 159, 198, 22, 39, 23, 75, 86, 38,
      129, 110, 89, 75, 111, 188,
    ],
    output: 166,
  },
  {
    input: [
      122, 179, 17, 51, 135, 2, 109, 181, 112, 41, 68, 107, 200, 163, 143, 68,
      36, 82, 68, 33, 99, 56, 175, 73, 17, 194, 104, 149, 190, 35, 72, 106, 170,
      105, 117, 160, 181, 161, 171, 5, 125,
    ],
    output: 198,
  },
];
runTests(testCases, algorithmicStockTraderI);
