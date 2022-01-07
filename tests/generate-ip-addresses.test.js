import { generateIpAddresses } from '../scripts/contracts/generate-ip-addresses';
import { runTests } from './utils';

const testCases = [
  { input: '135185197181', output: ['135.185.197.181'] },
  {
    input: '04748126',
    output: ['0.47.48.126'],
  },
];
runTests(testCases, generateIpAddresses);
