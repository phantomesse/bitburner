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
  {
    input: [
      80, 11, 91, 22, 122, 24, 50, 103, 41, 7, 30, 11, 119, 33, 13, 4, 19, 86,
      161, 21, 125, 55, 13, 23, 9, 114, 192, 65, 137, 75, 158, 113, 69, 66, 55,
      137, 199, 92, 186, 120, 137, 13, 188, 134, 120, 109, 123, 43, 123, 53,
    ],
    output: 195,
  },
  {
    input: [
      71, 77, 59, 26, 111, 42, 183, 21, 23, 114, 27, 95, 73, 127, 57, 27, 30,
      164, 71, 112, 156, 73, 9, 60, 108, 71, 35, 166, 95,
    ],
    output: 157,
  },
  {
    input: [
      163, 197, 176, 169, 72, 7, 166, 194, 71, 139, 99, 84, 133, 180, 163, 106,
      124, 82, 38, 197,
    ],
    output: 190,
  },
  {
    input: [
      33, 20, 81, 163, 12, 102, 62, 28, 137, 173, 118, 45, 84, 89, 3, 42, 162,
      156, 151, 152, 142, 3, 119, 143, 81, 47, 189,
    ],
    output: 186,
  },
  {
    input: [199, 5, 36, 81, 151, 187, 93, 134, 107, 165, 48, 112],
    output: 182,
  },
  {
    input: [
      171, 113, 194, 181, 102, 33, 126, 92, 36, 118, 103, 123, 31, 101, 12, 197,
      35, 200, 78, 9, 45, 165, 102, 51, 96, 56, 46, 120, 39, 62, 150,
    ],
    output: 188,
  },
  {
    input: [116, 189, 61, 68, 187, 199, 145, 4, 176, 85, 129, 185, 51],
    output: 181,
  },
];
runTests(testCases, algorithmicStockTraderI);
