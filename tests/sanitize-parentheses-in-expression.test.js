import { sanitizeParenthesesInExpression } from '../scripts/contracts/sanitize-parentheses-in-expression';
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
  { input: ')(()))(()))()a((', output: ['(()(()))()a', '(())(())()a'] },
  { input: '(((a((a))', output: ['a((a))', '(a(a))', '((aa))'] },
  {
    input: '(((())(((a(a(a)((a)',
    output: [
      '(())aa(a)(a)',
      '(())a(aa)(a)',
      '(())a(a(a)a)',
      '(())(aaa)(a)',
      '(())(aa(a)a)',
      '(())(a(aa)a)',
      '(())((aaa)a)',
      '((())aaa)(a)',
      '((())aa(a)a)',
      '((())a(aa)a)',
      '((())(aaa)a)',
      '(((())aaa)a)',
    ],
  },
  {
    input: ')((((()a(())))()a())',
    output: [
      '(((()a(())))()a())',
      '((((()a())))()a())',
      '((((()a(()))))a())',
      '((((()a(())))()a))',
    ],
  },
  { input: '(()))(', output: ['(())'] },
];
runTests(
  testCases,
  sanitizeParenthesesInExpression,
  (
    /** @type {string[]} */ actualOutput,
    /** @type {string[]} */ expectedOutput
  ) => {
    expect(actualOutput).toEqual(expect.arrayContaining(expectedOutput));
  }
);
