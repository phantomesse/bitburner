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
];
runTests(testCases, mergeOverlappingIntervals);
