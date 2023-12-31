/**
 * Sanitize Parentheses in Expression
 *
 * Remove the minimum number of invalid parentheses in order to validate the
 * string. If there are multiple minimal ways to validate the string, provide
 * all of the possible results. The answer should be provided as an array of
 * strings. If it is impossible to validate the string the result should be an
 * array with only an empty string.
 *
 * IMPORTANT: The string may contain letters, not just parentheses.
 *
 * @param {string} input
 * @returns {string[]}
 */
export function sanitizeParenthesesInExpression(input) {
  if (_isValid(input)) return [input];

  let parenthesesToRemove = 1;
  let variants = [];
  while (parenthesesToRemove <= input.length) {
    variants = [...new Set(_getVariants(input, parenthesesToRemove))].filter(
      _isValid
    );
    if (variants.length > 0) break;
    parenthesesToRemove++;
  }
  return variants;
}

/**
 * @param {string} str
 * @param {number} parenthesesToRemove
 * @returns {string[]}
 */
function _getVariants(str, parenthesesToRemove) {
  if (parenthesesToRemove === 0) return [str];
  const variants = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) !== '(' && str.charAt(i) !== ')') continue;
    const variant = str.substring(0, i) + str.substring(i + 1, str.length);
    if (parenthesesToRemove === 1) {
      variants.push(variant);
    } else {
      const furtherVariants = _getVariants(variant, parenthesesToRemove - 1);
      for (const furtherVariant of furtherVariants) {
        if (variants.includes(furtherVariant)) continue;
        variants.push(furtherVariant);
      }
    }
  }
  return variants;
}

function _isValid(str) {
  if (str === '') return true;
  const stack = [];
  const characters = str.split('');
  for (const character of characters) {
    if (character === '(') stack.push(character);
    else if (character === ')' && stack.pop() !== '(') return false;
  }
  return stack.length === 0;
}
