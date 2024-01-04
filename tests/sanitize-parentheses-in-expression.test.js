import { expect } from '@jest/globals';
import sanitizeParenthesesInExpression from 'contracts/sanitize-parentheses-in-expression';
import runTests from 'run-tests';

const testCases = [
  { input: '()())()', output: ['()()()', '(())()'] },
  { input: '(a)())()', output: ['(a)()()', '(a())()'] },
  { input: ')(', output: [''] },
  { input: ')))a())a)((', output: ['a(a)', 'a()a'] },
];

runTests(
  testCases,
  sanitizeParenthesesInExpression,
  (actualOutput, expectedOutput) => {
    expect(actualOutput.sort()).toEqual(expectedOutput.sort());
  }
);
