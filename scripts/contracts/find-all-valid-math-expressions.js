/**
 * Find All Valid Math Expressions
 *
 * You are given a string which contains only digits between 0 and 9 as well as
 * a target number. Return all possible ways you can add the +, -, and *
 * operators to the string of digits such that it evaluates to the target number.
 *
 * The answer should be provided as an array of strings containing the valid
 * expressions.
 *
 * NOTE: Numbers in an expression cannot have leading 0’s
 * NOTE: The order of evaluation expects script operator precedence
 *
 * Examples:
 * Input: digits = “123”, target = 6
 * Output: [1+2+3, 1*2*3]
 *
 * Input: digits = “105”, target = 5
 * Output: [1*0+5, 10-5]
 *
 * @param {[string, number]} input
 * @returns {string[]} valid expressions
 */
export default function findAllValidMathExpressions(input) {
  const [digits, target] = input;
  return getExpressions(digits, target, '');
}

const operators = ['+', '-', '*'];

/**
 * Gets all possible expressions.
 *
 * @param {string} digits
 * @param {number} target
 * @param {string} expressionThusFar
 * @returns {string[]} expressions
 */
function getExpressions(digits, target, expressionThusFar) {
  if (digits.length === 0) {
    return eval(expressionThusFar) === target ? [expressionThusFar] : [];
  }
  const expressions = [];
  for (let i = 1; i <= digits.length; i++) {
    const number = digits.substring(0, i);
    if (number.length > 1 && number.startsWith(0)) continue;
    if (expressionThusFar.length === 0) {
      expressions.push(...getExpressions(digits.substring(i), target, number));
    } else {
      for (const operator of operators) {
        expressions.push(
          ...getExpressions(
            digits.substring(i),
            target,
            expressionThusFar + operator + number
          )
        );
      }
    }
  }
  return expressions;
}
