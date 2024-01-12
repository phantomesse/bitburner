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
 * @param {string} expression
 * @returns {string[]} valid expressions
 */
export default function sanitizeParenthesesInExpression(expression) {
  let charactersToRemove = 0;
  let expressions = [expression];
  while (charactersToRemove < expression.length) {
    const validExpressions = new Set();
    for (const expression of expressions) {
      if (isValidExpression(expression)) validExpressions.add(expression);
    }
    if (validExpressions.size > 0) return [...validExpressions];

    const shortenedExpressions = new Set();
    for (const expression of expressions) {
      for (let i = 0; i < expression.length; i++) {
        shortenedExpressions.add(
          expression.substring(0, i) + expression.substring(i + 1)
        );
      }
    }
    expressions = [...shortenedExpressions];

    charactersToRemove++;
  }
  return [];
}

/** @type {Object.<string, boolean>} */
const expressionToIsValidMap = {};

/**
 * @param {string} expression
 * @returns {boolean} is valid
 */
function isValidExpression(expression) {
  if (expression in expressionToIsValidMap) {
    return expressionToIsValidMap[expression];
  }

  let stack = 0;
  for (let i = 0; i < expression.length; i++) {
    const character = expression.charAt(i);
    if (character === '(') stack++;
    else if (character === ')') stack--;
    if (stack < 0) break;
  }
  expressionToIsValidMap[expression] = stack === 0;
  return expressionToIsValidMap[expression];
}
