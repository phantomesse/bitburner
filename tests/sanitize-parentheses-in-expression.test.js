import { sanitizeParenthesesInExpression } from '../scripts/contracts/sanitize-parentheses-in-expression.js';
import { runTests } from './utils';

const testCases = [
  {
    input: '(a)))()a)(()))(',
    output: [
      '(a(a)(()))',
      '(a()a(()))',
      '(a()a)(())',
      '(a)(a(()))',
      '(a)(a)(())',
      '(a)()a(())',
    ],
  },
  {
    input: ')(',
    output: [''],
  },
  {
    input: '()())()',
    output: ['()()()', '(())()'],
  },
  {
    input: '(a)())()',
    output: ['(a)()()', '(a())()'],
  },
  {
    input: '()(a))(',
    output: ['((a))', '()(a)'],
  },
];
runTests(
  testCases,
  sanitizeParenthesesInExpression,
  (actualOutput, expectedOutput) => {
    expect(actualOutput).toEqual(expect.arrayContaining(expectedOutput));
  }
);
