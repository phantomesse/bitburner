/**
 * Sanitize Parentheses in Expression
 *
 * Given the following string:
 *
 * )))a())a)((
 *
 * remove the minimum number of invalid parentheses in order to validate the
 * string. If there are multiple minimal ways to validate the string, provide
 * all of the possible results. The answer should be provided as an array of
 * strings. If it is impossible to validate the string the result should be an
 * array with only an empty string.
 *
 * IMPORTANT: The string may contain letters, not just parentheses. Examples:
 * "()())()" -> ["()()()", "(())()"]
 * "(a)())()" -> ["(a)()()", "(a())()"]
 * ")(" -> [""]
 *
 * @param {string} input
 */
export default function sanitizeParenthesesInExpression(input) {
  // Input expression is already valid.
  if (isValidExpression(input)) return [input];

  const validExpressions = [...new Set(getValidExpressions(input))];
  return validExpressions.length > 0 ? validExpressions : [''];
}

/**
 * Returns a list of the most minimal valid exprssions.
 *
 * @param {string} expression
 * @returns {string[]} valid expressions or empty array if no valid found
 */
function getValidExpressions(expression) {
  if (expression.length === 1) return [];

  const shortenedExpressions = new Set();
  for (let i = 0; i < expression.length; i++) {
    shortenedExpressions.add(expression.slice(0, i) + expression.slice(i + 1));
  }
  const validExpressions = [...shortenedExpressions].filter(isValidExpression);
  if (validExpressions.length > 0) return validExpressions;

  for (const shortenedExpression of shortenedExpressions) {
    validExpressions.push(...getValidExpressions(shortenedExpression));
  }
  let longestExpressionLength = validExpressions.reduce(
    (longestLength, expression) => Math.max(longestLength, expression.length),
    0
  );
  return validExpressions.filter(
    expression => expression.length === longestExpressionLength
  );
}

/**
 * Checks if an expression is valid based on the parentheses pairs.
 *
 * @param {string} expression
 */
function isValidExpression(expression) {
  const parentheses = [];
  const characters = expression.split('');
  for (const character of characters) {
    switch (character) {
      case '(':
        parentheses.push(1);
        break;
      case ')':
        if (parentheses.pop() === undefined) return false;
        break;
    }
  }
  return parentheses.length === 0;
}
