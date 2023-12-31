/**
 * @typedef {Object} TestCase
 * @property {any} input
 * @property {any} output
 */

/**
 * @callback FunctionToTest
 * @param {any} input
 * @returns {any} output
 */

/**
 * @callback CustomTestFunction
 * @param {any} actualOutput
 * @param {any} expectedOutput
 */

/**
 * Runs a series of test cases.
 *
 * @param {TestCase[]} testCases
 * @param {FunctionToTest} fnToTest
 * @param {CustomTestFunction} [customTestFn]
 */
export function runTests(testCases, fnToTest, customTestFn) {
  for (const testCase of testCases) {
    test(`${testCase.input} => ${testCase.output}`, () => {
      if (customTestFn) {
        customTestFn(fnToTest(testCase.input), testCase.output);
      } else {
        expect(fnToTest(testCase.input)).toEqual(testCase.output);
      }
    });
  }
}

/** Add this to a test file to skip all tests in the test file. */
export const skip = () => test.skip('', () => {});
