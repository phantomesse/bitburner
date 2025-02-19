/**
 * Sanitize Parentheses in Expression
 *
 * Given the following string:
 *
 * ((()((())a
 *
 * remove the minimum number of invalid parentheses in order to validate the
 * string. If there are multiple minimal ways to validate the string, provide
 * all of the possible results. The answer should be provided as an array of
 * strings. If it is impossible to validate the string the result should be an
 * array with only an empty string.
 *
 * IMPORTANT: The string may contain letters, not just parentheses.
 *
 * Examples:
 *
 * "()())()" -> ["()()()", "(())()"]
 * "(a)())()" -> ["(a)()()", "(a())()"]
 * ")(" -> [""]
 *
 * @param {string} input
 * @returns {string[]}
 */
export function solveSanitizeParenthesesInExpression(input) {
  return getValidStrings(input);
}

const stringToValidStringsMap = {};

/**
 * @param {string} string
 * @returns {string[]}
 */
function getValidStrings(string) {
  if (string in stringToValidStringsMap) return stringToValidStringsMap[string];

  if (isValid(string)) {
    stringToValidStringsMap[string] = [string];
    return stringToValidStringsMap[string];
  }

  // Get substrings.
  const substrings = getSubstrings(string);

  const validStrings = new Set();
  for (const substring of substrings) {
    if (isValid(substring)) validStrings.add(substring);
  }
  if (validStrings.size > 0) {
    stringToValidStringsMap[string] = [...validStrings];
    return stringToValidStringsMap[string];
  }

  let longestValidStringLength = 0;
  for (const substring of substrings) {
    const validStringList = getValidStrings(substring);
    for (const validString of validStringList) {
      validStrings.add(validString);
      longestValidStringLength = Math.max(
        longestValidStringLength,
        validString.length
      );
    }
  }

  stringToValidStringsMap[string] = [...validStrings].filter(
    (validString) => validString.length === longestValidStringLength
  );
  return stringToValidStringsMap[string];
}

const stringToSubstringsMap = {};

/**
 * @param {string} string
 * @returns {string[]}
 */
function getSubstrings(string) {
  if (string in stringToSubstringsMap) return stringToSubstringsMap[string];

  const substrings = new Set();
  for (let i = 0; i < string.length; i++) {
    const character = string.charAt(i);
    if (character !== '(' && character !== ')') continue;
    substrings.add(string.substring(0, i) + string.substring(i + 1));
  }
  stringToSubstringsMap[string] = [...substrings];
  return stringToSubstringsMap[string];
}

const stringToIsValidMap = {};

/**
 * @param {string} string
 * @returns {boolean}
 */
function isValid(string) {
  if (string in stringToIsValidMap) return stringToIsValidMap[string];

  let stack = 0;
  for (let i = 0; i < string.length; i++) {
    const character = string.charAt(i);
    if (character === '(') stack++;
    if (character === ')') stack--;
    if (stack < 0) {
      stringToIsValidMap[string] = false;
      return false;
    }
  }

  stringToIsValidMap[string] = stack === 0;
  return stringToIsValidMap[string];
}
