import { mergeOverlappingIntervals } from '../scripts/contracts/merge-overlapping-intervals';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      [1, 10],
      [2, 5],
      [11, 17],
      [11, 17],
      [14, 23],
      [23, 33],
      [24, 29],
    ],
    output: [
      [1, 10],
      [11, 33],
    ],
  },
  {
    input: [
      [1, 11],
      [5, 13],
      [11, 17],
      [12, 22],
      [14, 19],
      [15, 16],
    ],
    output: [[1, 22]],
  },
  {
    input: [
      [3, 13],
      [6, 16],
      [8, 13],
      [9, 11],
      [9, 12],
      [9, 18],
      [13, 17],
      [13, 21],
      [16, 19],
      [16, 26],
      [17, 24],
      [17, 27],
      [23, 27],
      [23, 30],
      [24, 30],
      [25, 28],
    ],
    output: [[3, 30]],
  },
];
runTests(testCases, mergeOverlappingIntervals);
