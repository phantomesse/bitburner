import { generateIpAddresses } from '../scripts/contracts/generate-ip-addresses';
import { runTests } from './utils';

const testCases = [
  { input: '135185197181', output: ['135.185.197.181'] },
  {
    input: '04748126',
    output: ['0.47.48.126'],
  },
  { input: '114227110211', output: ['114.227.110.211'] },
  { input: '20152128234', output: ['20.152.128.234', '201.52.128.234'] },
];
runTests(testCases, generateIpAddresses);
