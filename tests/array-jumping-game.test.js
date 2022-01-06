import { arrayJumpingGame } from '../scripts/contracts/array-jumping-game.js';
import { runTests } from './utils';

const testCases = [
  {
    input: [0, 0, 6, 9, 1, 4, 7, 0, 2, 10, 0, 9, 1, 1, 0, 0, 10, 7, 5, 0, 0],
    output: 0,
  },
  { input: [0, 5, 1], output: 0 },
];
runTests(testCases, arrayJumpingGame);
