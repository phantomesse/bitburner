/**
 * Find All Valid Math Expressions
 *
 * You are given the following string which contains only digits between 0 and 9:
 *
 * 2573869
 *
 * You are also given a target number of -15. Return all possible ways you can
 * add the +(add), -(subtract), and *(multiply) operators to the string such
 * that it evaluates to the target number. (Normal order of operations applies.)
 *
 * The provided answer should be an array of strings containing the valid
 * expressions. The data provided by this problem is an array with two elements.
 * The first element is the string of digits, while the second element is the
 * target number:
 *
 * ["2573869", -15]
 *
 * NOTE: The order of evaluation expects script operator precedence.
 *
 * NOTE: Numbers in the expression cannot have leading 0's. In other words,
 * "1+01" is not a valid expression.
 *
 * Examples:
 *
 * Input: digits = "123", target = 6
 * Output: ["1+2+3", "1*2*3"]
 *
 * Input: digits = "105", target = 5
 * Output: ["1*0+5", "10-5"]
 *
 * @param {[string, number]} input
 * @returns {string[]}
 */
export function solveFindAllValidMathExpressions(input) {
  const [digits, target] = input;

  /** @type {number[][]} */ const validNumbersList = getValidNumbers(digits);
  const validExpressions = [];
  for (const numbers of validNumbersList) {
    if (numbers.length === 1) {
      if (numbers[0] === target) validExpressions.push(numbers[0]);
      continue;
    }

    const expressions = getExpressions(numbers);
    for (const expression of expressions) {
      if (eval(expression) === target) validExpressions.push(expression);
    }
  }
  return validExpressions;
}

/**
 * @param {number[]} numbers
 * @param {string = ''} expressionThusFar
 * @returns {string[]}
 */
function getExpressions(numbers, expressionThusFar = '') {
  if (numbers.length === 1) return [expressionThusFar + numbers[0]];
  return [
    ...getExpressions(numbers.slice(1), expressionThusFar + numbers[0] + '+'),
    ...getExpressions(numbers.slice(1), expressionThusFar + numbers[0] + '-'),
    ...getExpressions(numbers.slice(1), expressionThusFar + numbers[0] + '*'),
  ];
}

/**
 * Extracts an array of valid numbers using the given digits.
 *
 * @param {string} digits
 * @param {number[] = []} numbersThusFar
 * @returns {number[][]}
 */
function getValidNumbers(digits, numbersThusFar = []) {
  if (digits.length === 0) return [numbersThusFar];

  /** @type {number} */ const firstNumbers = [];
  for (let i = 1; i <= digits.length; i++) {
    const firstNumberString = digits.substring(0, i);
    const firstNumber = parseInt(firstNumberString);
    if (firstNumberString.startsWith('0') && firstNumber !== 0) continue;
    firstNumbers.push(firstNumber);
  }

  /** @type {number[][]} */ const validNumbers = [];
  for (const firstNumber of firstNumbers) {
    validNumbers.push(
      ...getValidNumbers(digits.substring(`${firstNumber}`.length), [
        ...numbersThusFar,
        firstNumber,
      ])
    );
  }
  return validNumbers;
}
