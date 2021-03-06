import { shortestPathInAGrid } from '../scripts/contracts/shortest-path-in-a-grid';
import { runTests } from './utils';

const testCases = [
  {
    input: [
      [0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0],
    ],
    output: 'DRRURRD',
  },
  {
    input: [
      [0, 1],
      [1, 0],
    ],
    output: '',
  },
  {
    input: [
      [0, 1, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 0, 0, 0, 0],
    ],
    output: 'DRDDRDRDDRDRRR',
  },
  {
    input: [
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    ],
    output: '',
  },
];
runTests(testCases, shortestPathInAGrid);
