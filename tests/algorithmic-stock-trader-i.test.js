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
];
runTests(testCases, algorithmicStockTraderI);
