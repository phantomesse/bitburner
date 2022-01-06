export function runTests(testCases, fnToTest) {
  for (const testCase of testCases) {
    test(`${testCase.input} => ${testCase.output}`, () => {
      expect(fnToTest(testCase.input)).toEqual(testCase.output);
    });
  }
}

export const skip = () => test.skip('', () => {});
