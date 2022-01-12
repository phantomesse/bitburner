import { algorithmicStockTraderIV } from '../scripts/contracts/algorithmic-stock-trader';
import { runTests } from './utils';

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
  {
    input: [
      5,
      [
        134, 63, 16, 197, 8, 88, 114, 60, 129, 59, 30, 25, 178, 197, 67, 195,
        104, 90, 63, 84, 7, 185, 4, 152, 27, 30, 141, 132, 118, 143, 124, 118,
        9,
      ],
    ],
    output: 824,
  },
  {
    input: [
      7,
      [
        192, 132, 155, 181, 174, 157, 67, 97, 10, 139, 39, 168, 158, 21, 74,
        192, 163, 191, 161, 179, 144, 35, 35, 197, 136, 17, 91, 92, 123, 94,
        183, 114, 149, 119, 167, 66, 26, 174, 171, 84, 159, 47, 37,
      ],
    ],
    output: 980,
  },
  {
    input: [
      2,
      [
        178, 121, 85, 186, 5, 141, 45, 36, 157, 14, 110, 187, 185, 65, 40, 39,
        55, 58, 33, 148, 99, 119, 2, 77, 131, 74, 134, 77, 8, 130, 16, 6, 166,
        46, 149, 28, 77,
      ],
    ],
    output: 346,
  },
  {
    input: [
      2,
      [
        127, 97, 31, 57, 55, 183, 109, 77, 73, 43, 163, 195, 37, 57, 33, 29, 90,
        84, 91, 27, 149, 20, 16, 68, 28, 22, 191, 100, 181,
      ],
    ],
    output: 339,
  },
  {
    input: [
      2,
      [
        113, 53, 64, 66, 164, 188, 39, 106, 153, 58, 192, 47, 99, 79, 155, 131,
        187, 78, 39, 112, 90, 10, 160, 85, 114, 174, 105, 180, 38, 78, 163, 182,
        121, 109, 176,
      ],
    ],
    output: 325,
  },
  { input: [9, [134, 181, 115, 129, 165, 65]], output: 97 },
];
runTests(testCases, algorithmicStockTraderIV);
