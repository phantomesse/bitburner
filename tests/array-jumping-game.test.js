import { arrayJumpingGame } from '../scripts/contracts/array-jumping-game';
import { runTests } from './utils';

const testCases = [
  {
    input: [0, 0, 6, 9, 1, 4, 7, 0, 2, 10, 0, 9, 1, 1, 0, 0, 10, 7, 5, 0, 0],
    output: 0,
  },
  { input: [0, 5, 1], output: 0 },
  { input: [8, 6, 5, 0, 1, 1, 0, 8, 0, 8, 10, 4, 1, 5], output: 1 },
  { input: [0, 0, 0, 4, 0, 0, 0, 0, 7], output: 0 },
  { input: [5, 2, 6, 0], output: 1 },
  { input: [7, 0, 4, 9, 6, 4, 6, 10, 0, 1, 0, 4, 0, 0, 4], output: 1 },
  { input: [9, 0, 7, 0, 6, 4, 7, 2], output: 1 },
];
runTests(testCases, arrayJumpingGame);
