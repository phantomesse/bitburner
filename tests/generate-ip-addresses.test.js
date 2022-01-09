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
  {
    input: '771241193',
    output: [
      '7.71.241.193',
      '77.1.241.193',
      '77.12.41.193',
      '77.124.1.193',
      '77.124.11.93',
      '77.124.119.3',
    ],
  },
  { input: '5822817460', output: ['58.228.174.60'] },
  { input: '2613314577', output: ['26.133.145.77'] },
];
runTests(testCases, generateIpAddresses);
