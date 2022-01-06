import { generateIpAddresses } from '../scripts/contracts/generate-ip-addresses';
import { runTests } from './utils';

const testCases = [{ input: '135185197181', output: ['135.185.197.181'] }];
runTests(testCases, generateIpAddresses);
