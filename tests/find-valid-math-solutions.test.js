import { findValidMathExpressions } from '../scripts/contracts/find-valid-math-solutions';
import { runTests } from './utils';

const testCases = [
  {
    input: ['2072048905', 48],
    output: [
      '2+0+7+2+0+4*8+9*0+5',
      '2+0+7+2+0+4*8-9*0+5',
      '2+0+7+2-0+4*8+9*0+5',
      '2+0+7+2-0+4*8-9*0+5',
      '2+0+7-2+0+4*8+9+0*5',
      '2+0+7-2+0+4*8+9-0*5',
      '2+0+7-2-0+4*8+9+0*5',
      '2+0+7-2-0+4*8+9-0*5',
      '2+0+7*2+0+4*8+9*0*5',
      '2+0+7*2+0+4*8-9*0*5',
      '2+0+7*2-0+4*8+9*0*5',
      '2+0+7*2-0+4*8-9*0*5',
      '2+0+7*2*0+4*8+9+0+5',
      '2+0+7*2*0+4*8+9-0+5',
      '2+0-7*2*0+4*8+9+0+5',
      '2+0-7*2*0+4*8+9-0+5',
      '2+0*7+2*0+4*8+9+0+5',
      '2+0*7+2*0+4*8+9-0+5',
      '2+0*7-2*0+4*8+9+0+5',
      '2+0*7-2*0+4*8+9-0+5',
      '2+0*7*2+0+4*8+9+0+5',
      '2+0*7*2+0+4*8+9-0+5',
      '2+0*7*2-0+4*8+9+0+5',
      '2+0*7*2-0+4*8+9-0+5',
      '2+0*7*2*0+4*8+9+0+5',
      '2+0*7*2*0+4*8+9-0+5',
      '2-0+7+2+0+4*8+9*0+5',
      '2-0+7+2+0+4*8-9*0+5',
      '2-0+7+2-0+4*8+9*0+5',
      '2-0+7+2-0+4*8-9*0+5',
      '2-0+7-2+0+4*8+9+0*5',
      '2-0+7-2+0+4*8+9-0*5',
      '2-0+7-2-0+4*8+9+0*5',
      '2-0+7-2-0+4*8+9-0*5',
      '2-0+7*2+0+4*8+9*0*5',
      '2-0+7*2+0+4*8-9*0*5',
      '2-0+7*2-0+4*8+9*0*5',
      '2-0+7*2-0+4*8-9*0*5',
      '2-0+7*2*0+4*8+9+0+5',
      '2-0+7*2*0+4*8+9-0+5',
      '2-0-7*2*0+4*8+9+0+5',
      '2-0-7*2*0+4*8+9-0+5',
      '2-0*7+2*0+4*8+9+0+5',
      '2-0*7+2*0+4*8+9-0+5',
      '2-0*7-2*0+4*8+9+0+5',
      '2-0*7-2*0+4*8+9-0+5',
      '2-0*7*2+0+4*8+9+0+5',
      '2-0*7*2+0+4*8+9-0+5',
      '2-0*7*2-0+4*8+9+0+5',
      '2-0*7*2-0+4*8+9-0+5',
      '2-0*7*2*0+4*8+9+0+5',
      '2-0*7*2*0+4*8+9-0+5',
      '2*0+7+2*0+4*8+9+0*5',
      '2*0+7+2*0+4*8+9-0*5',
      '2*0+7-2*0+4*8+9+0*5',
      '2*0+7-2*0+4*8+9-0*5',
      '2*0*7+2+0+4*8+9+0+5',
      '2*0*7+2+0+4*8+9-0+5',
      '2*0*7+2-0+4*8+9+0+5',
      '2*0*7+2-0+4*8+9-0+5',
      '20+7+2*0+4+8+9+0*5',
      '20+7+2*0+4+8+9-0*5',
      '20+7-2+0+4*8-9+0*5',
      '20+7-2+0+4*8-9-0*5',
      '20+7-2-0+4*8-9+0*5',
      '20+7-2-0+4*8-9-0*5',
      '20+7-2*0+4+8+9+0*5',
      '20+7-2*0+4+8+9-0*5',
      '20+7*2+0*4*8+9+0+5',
      '20+7*2+0*4*8+9-0+5',
      '20+7*2-0*4*8+9+0+5',
      '20+7*2-0*4*8+9-0+5',
      '20+7*2*0+4*8-9+0+5',
      '20+7*2*0+4*8-9-0+5',
      '20-7-2+0+4*8+9*0+5',
      '20-7-2+0+4*8-9*0+5',
      '20-7-2-0+4*8+9*0+5',
      '20-7-2-0+4*8-9*0+5',
      '20-7*2*0+4*8-9+0+5',
      '20-7*2*0+4*8-9-0+5',
      '2+0+72+0-4-8-9+0-5',
      '2+0+72+0-4-8-9-0-5',
      '2+0+72-0-4-8-9+0-5',
      '2+0+72-0-4-8-9-0-5',
      '2+0+72*0+4*8+9+0+5',
      '2+0+72*0+4*8+9-0+5',
      '2+0-72*0+4*8+9+0+5',
      '2+0-72*0+4*8+9-0+5',
      '2+0*72+0+4*8+9+0+5',
      '2+0*72+0+4*8+9-0+5',
      '2+0*72-0+4*8+9+0+5',
      '2+0*72-0+4*8+9-0+5',
      '2+0*72*0+4*8+9+0+5',
      '2+0*72*0+4*8+9-0+5',
      '2-0+72+0-4-8-9+0-5',
      '2-0+72+0-4-8-9-0-5',
      '2-0+72-0-4-8-9+0-5',
      '2-0+72-0-4-8-9-0-5',
      '2-0+72*0+4*8+9+0+5',
      '2-0+72*0+4*8+9-0+5',
      '2-0-72*0+4*8+9+0+5',
      '2-0-72*0+4*8+9-0+5',
      '2-0*72+0+4*8+9+0+5',
      '2-0*72+0+4*8+9-0+5',
      '2-0*72-0+4*8+9+0+5',
      '2-0*72-0+4*8+9-0+5',
      '2-0*72*0+4*8+9+0+5',
      '2-0*72*0+4*8+9-0+5',
      '20+72*0+4*8-9+0+5',
      '20+72*0+4*8-9-0+5',
      '20-72*0+4*8-9+0+5',
      '20-72*0+4*8-9-0+5',
      '2+0-7-20-4+8*9+0+5',
      '2+0-7-20-4+8*9-0+5',
      '2+0*7+20+4+8+9+0+5',
      '2+0*7+20+4+8+9-0+5',
      '2+0*7*20+4*8+9+0+5',
      '2+0*7*20+4*8+9-0+5',
      '2-0-7-20-4+8*9+0+5',
      '2-0-7-20-4+8*9-0+5',
      '2-0*7+20+4+8+9+0+5',
      '2-0*7+20+4+8+9-0+5',
      '2-0*7*20+4*8+9+0+5',
      '2-0*7*20+4*8+9-0+5',
      '2*0+7+20+4+8+9+0*5',
      '2*0+7+20+4+8+9-0*5',
      '2*0*7+20+4*8-9+0+5',
      '2*0*7+20+4*8-9-0+5',
      '2*0*7-20-4+8*9+0*5',
      '2*0*7-20-4+8*9-0*5',
      '20+7+20+4-8+9*0+5',
      '20+7+20+4-8-9*0+5',
      '20+7+20-4+8*9*0+5',
      '20+7+20-4-8*9*0+5',
      '20+7-20+4*8+9+0*5',
      '20+7-20+4*8+9-0*5',
      '20*7-20*4-8-9+0+5',
      '20*7-20*4-8-9-0+5',
      '2+0*720+4*8+9+0+5',
      '2+0*720+4*8+9-0+5',
      '2-0*720+4*8+9+0+5',
      '2-0*720+4*8+9-0+5',
      '2+0+7+2*0+48-9+0*5',
      '2+0+7+2*0+48-9-0*5',
      '2+0+7-2*0+48-9+0*5',
      '2+0+7-2*0+48-9-0*5',
      '2+0-7+2*0+48+9*0+5',
      '2+0-7+2*0+48-9*0+5',
      '2+0-7-2*0+48+9*0+5',
      '2+0-7-2*0+48-9*0+5',
      '2+0*7+2+0+48-9+0+5',
      '2+0*7+2+0+48-9-0+5',
      '2+0*7+2-0+48-9+0+5',
      '2+0*7+2-0+48-9-0+5',
      '2+0*7-2+0+48+9*0*5',
      '2+0*7-2+0+48-9*0*5',
      '2+0*7-2-0+48+9*0*5',
      '2+0*7-2-0+48-9*0*5',
      '2-0+7+2*0+48-9+0*5',
      '2-0+7+2*0+48-9-0*5',
      '2-0+7-2*0+48-9+0*5',
      '2-0+7-2*0+48-9-0*5',
      '2-0-7+2*0+48+9*0+5',
      '2-0-7+2*0+48-9*0+5',
      '2-0-7-2*0+48+9*0+5',
      '2-0-7-2*0+48-9*0+5',
      '2-0*7+2+0+48-9+0+5',
      '2-0*7+2+0+48-9-0+5',
      '2-0*7+2-0+48-9+0+5',
      '2-0*7+2-0+48-9-0+5',
      '2-0*7-2+0+48+9*0*5',
      '2-0*7-2+0+48-9*0*5',
      '2-0*7-2-0+48+9*0*5',
      '2-0*7-2-0+48-9*0*5',
      '2*0+7+2+0+48-9+0*5',
      '2*0+7+2+0+48-9-0*5',
      '2*0+7+2-0+48-9+0*5',
      '2*0+7+2-0+48-9-0*5',
      '2*0+7-2+0+48+9*0-5',
      '2*0+7-2+0+48-9*0-5',
      '2*0+7-2-0+48+9*0-5',
      '2*0+7-2-0+48-9*0-5',
      '2*0+7*2+0+48-9+0-5',
      '2*0+7*2+0+48-9-0-5',
      '2*0+7*2-0+48-9+0-5',
      '2*0+7*2-0+48-9-0-5',
      '2*0+7*2*0+48+9*0*5',
      '2*0+7*2*0+48-9*0*5',
      '2*0-7+2+0+48+9*0+5',
      '2*0-7+2+0+48-9*0+5',
      '2*0-7+2-0+48+9*0+5',
      '2*0-7+2-0+48-9*0+5',
      '2*0-7-2+0+48+9+0*5',
      '2*0-7-2+0+48+9-0*5',
      '2*0-7-2-0+48+9+0*5',
      '2*0-7-2-0+48+9-0*5',
      '2*0-7*2+0+48+9+0+5',
      '2*0-7*2+0+48+9-0+5',
      '2*0-7*2-0+48+9+0+5',
      '2*0-7*2-0+48+9-0+5',
      '2*0-7*2*0+48+9*0*5',
      '2*0-7*2*0+48-9*0*5',
      '2*0*7+2*0+48+9*0*5',
      '2*0*7+2*0+48-9*0*5',
      '2*0*7-2*0+48+9*0*5',
      '2*0*7-2*0+48-9*0*5',
      '2*0*7*2+0+48+9*0*5',
      '2*0*7*2+0+48-9*0*5',
      '2*0*7*2-0+48+9*0*5',
      '2*0*7*2-0+48-9*0*5',
      '2*0*7*2*0+48+9*0*5',
      '2*0*7*2*0+48-9*0*5',
      '20+7*2+0*48+9+0+5',
      '20+7*2+0*48+9-0+5',
      '20+7*2-0*48+9+0+5',
      '20+7*2-0*48+9-0+5',
      '20*7*2*0+48+9*0*5',
      '20*7*2*0+48-9*0*5',
      '207*2*0+48+9*0*5',
      '207*2*0+48-9*0*5',
      '2*0+72*0+48+9*0*5',
      '2*0+72*0+48-9*0*5',
      '2*0-72*0+48+9*0*5',
      '2*0-72*0+48-9*0*5',
      '2*0*72+0+48+9*0*5',
      '2*0*72+0+48-9*0*5',
      '2*0*72-0+48+9*0*5',
      '2*0*72-0+48-9*0*5',
      '2*0*72*0+48+9*0*5',
      '2*0*72*0+48-9*0*5',
      '20+72+0-48+9+0-5',
      '20+72+0-48+9-0-5',
      '20+72-0-48+9+0-5',
      '20+72-0-48+9-0-5',
      '20*72*0+48+9*0*5',
      '20*72*0+48-9*0*5',
      '2072*0+48+9*0*5',
      '2072*0+48-9*0*5',
      '2*0*7*20+48+9*0*5',
      '2*0*7*20+48-9*0*5',
      '2*0*720+48+9*0*5',
      '2*0*720+48-9*0*5',
      '20*7+2+0*4-89+0-5',
      '20*7+2+0*4-89-0-5',
      '20*7+2-0*4-89+0-5',
      '20*7+2-0*4-89-0-5',
      '20*7-2+0+4-89+0-5',
      '20*7-2+0+4-89-0-5',
      '20*7-2-0+4-89+0-5',
      '20*7-2-0+4-89-0-5',
      '20+7+20-4+89*0+5',
      '20+7+20-4-89*0+5',
      '2+0-7+2*0-4*8+90-5',
      '2+0-7-2*0-4*8+90-5',
      '2-0-7+2*0-4*8+90-5',
      '2-0-7-2*0-4*8+90-5',
      '2*0-7+2+0-4*8+90-5',
      '2*0-7+2-0-4*8+90-5',
      '2+0-7-20-4-8+90-5',
      '2-0-7-20-4-8+90-5',
      '2+0+7+2+0-48+90-5',
      '2+0+7+2-0-48+90-5',
      '2-0+7+2+0-48+90-5',
      '2-0+7+2-0-48+90-5',
      '20-7-2+0-48+90-5',
      '20-7-2-0-48+90-5',
      '2*0-7+20*48-905',
    ],
  },
];
runTests(testCases, findValidMathExpressions);
