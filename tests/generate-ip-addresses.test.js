import { generateIpAddresses } from '../scripts/contracts/generate-ip-addresses.js';
import { runTests } from './utils.js';

const testCases = [{ input: '135185197181', output: ['135.185.197.181'] }];
runTests(testCases, generateIpAddresses);
