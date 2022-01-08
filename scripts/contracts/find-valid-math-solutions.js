/**
 * Find All Valid Math Expressions
 *
 * Return all possible ways you can add the +, -, and * operators to the string
 * such that it evaluates to the target number.
 *
 * @param {any[]} input
 * @returns {string[]}
 */
export function findValidMathExpressions(input) {
  const digits = input[0]; // String
  const targetNumber = input[1]; // Integer

  const validExpressions = [];
  const numberCombinations = _getValidNumberCombinations(digits);
  for (const numberCombo of numberCombinations) {
    const expressions = _getExpressions(numberCombo);
    for (const expression of expressions) {
      if (eval(expression) === targetNumber) validExpressions.push(expression);
    }
  }
  return validExpressions;
}

const OPERATORS = ['+', '-', '*'];

/**
 * @param {number[]} numbers
 * @returns {string[]}
 */
function _getExpressions(numbers) {
  if (numbers.length === 1) return [numbers[0].toString()];
  const expressions = [];
  const prefixExpressions = _getExpressions(
    numbers.slice(0, numbers.length - 1)
  );
  for (const prefixExpression of prefixExpressions) {
    for (const operator of OPERATORS) {
      expressions.push(
        prefixExpression + operator + numbers[numbers.length - 1]
      );
    }
  }
  return expressions;
}

/**
 * @param {string} digits
 * @returns {number[][]} arrays that represent combinations of valid numbers
 *                       (i.e. digits should not start with '0')
 */
function _getValidNumberCombinations(digits) {
  const possibleLastNumbers = [];
  for (let i = digits.length - 1; i >= 0; i--) {
    const number = digits.substring(i, digits.length);
    if (number.length > 1 && number.startsWith('0')) continue;
    possibleLastNumbers.push(parseInt(number));
  }
  const combinations = [];
  for (const lastNumber of possibleLastNumbers) {
    const prefix = digits.substring(
      0,
      digits.length - lastNumber.toString().length
    );
    if (prefix === '') {
      combinations.push([lastNumber]);
      continue;
    }
    const prefixCombinations = _getValidNumberCombinations(prefix);
    for (const prefixCombo of prefixCombinations) {
      combinations.push([...prefixCombo, lastNumber]);
    }
  }
  return combinations;
}
