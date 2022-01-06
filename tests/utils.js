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

export const skip = () => test.skip('', () => {});
