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
  return getMinimalRemovalValidStrings(input);
}

/**
 * @param {string} string
 * @returns {string[]}
 */
function getMinimalRemovalValidStrings(string) {
  if (isValid(string) || string === '') return [string];

  const allSubstrings = new Set();
  const validStrings = [];
  for (let i = 0; i < string.length; i++) {
    const substring = string.substring(0, i) + string.substring(i + 1);

    if (isValid(substring) && !validStrings.includes(substring)) {
      validStrings.push(substring);
    }

    if (substring.length > 1) allSubstrings.add(substring);
  }
  if (validStrings.length > 0) return validStrings;
  if (allSubstrings.size === 0) return [''];

  console.log(
    `string is ${string} and all substrings are ${[...allSubstrings]}`
  );
  for (const substring of allSubstrings) {
    // Add all valid strings from the substring to the list of valid strings.
    const validStringsFromSubstring = getMinimalRemovalValidStrings(substring);
    for (const validString of validStringsFromSubstring) {
      if (!validStrings.includes(validString)) validStrings.push(validString);
    }
  }

  if (validStrings.length === 0) return [''];

  // Only keep the longest valid strings.
  validStrings.sort((string1, string2) => string2.length - string1.length);
  const validStringLength = validStrings[0].length;
  const temp = validStrings.filter(
    (validString) => validString.length === validStringLength
  );
  console.log(temp);
  return temp;
}

const stringToIsValidMap = {};

/**
 * @param {string} string
 * @returns {boolean} whether the given input is valid
 */
function isValid(string) {
  if (string in stringToIsValidMap) return stringToIsValidMap[string];

  let parenthesesCount = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charAt(i);
    if (char === '(') parenthesesCount++;
    if (char === ')') parenthesesCount--;
    if (parenthesesCount < 0) {
      stringToIsValidMap[string] = false;
      return false;
    }
  }

  stringToIsValidMap[string] = parenthesesCount === 0;
  return stringToIsValidMap[string];
}

// console.log(solveSanitizeParenthesesInExpression('((aaaa)())(()((a'));
// console.log(solveSanitizeParenthesesInExpression('()(a()))))(a))())'));
