import { uniquePathsInAGridI } from '../scripts/contracts/unique-paths-in-a-grid';
import { runTests } from './utils';

const testCases = [{ input: [7, 11], output: 8008 }];
runTests(testCases, uniquePathsInAGridI);
