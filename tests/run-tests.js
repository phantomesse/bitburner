import { describe, expect, test } from '@jest/globals';

/**
 * @typedef {string|number|any[]} Input
 * @typedef {string|number|any[]} Output
 *
 * @typedef TestCase
 * @property {Input} input
 * @property {Output} output
 *
 * @callback TestFunction
 * @param {Input} input
 * @returns {Output} output
 *
 * @callback CustomExpectFunction
 * @param {Output} actualOutput
 * @param {Output} expectedOutput
 */

/**
 * @param {TestCase[]} testCases
 * @param {TestFunction} testFunction
 * @param {[CustomExpectFunction]} customExpectFunction
 */
export default function runTests(
  testCases,
  testFunction,
  customExpectFunction
) {
  describe(testFunction.name, () => {
    for (const testCase of testCases) {
      it(`${testCase.input} => ${testCase.output}`, () => {
        const actualOutput = testFunction(testCase.input);
        if (customExpectFunction) {
          customExpectFunction(actualOutput, testCase.output);
        } else {
          expect(actualOutput).toEqual(testCase.output);
        }
      });
    }
  });
}
