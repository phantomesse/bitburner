/**
 * Find All Valid Math Expressions
 *
 * Return all possible ways you can add the +, -, and * operators to the string
 * such that it evaluates to the target number.
 */

// const input = { digits: '123', target: 6 }; // Output: [1+2+3, 1*2*3]
const input = { digits: '105', target: 5 }; // Output: [1*0+5, 10-5]
// const input = { digits: '849331', target: -34 };

// let validExpressions = getAllExpressions(digits).filter(
//   expression => eval(expression) === input.target
// );
// console.log(validExpressions);

/**
 * @param {string} digits
 * @param {string} [expression=''] current expression so far
 * @param {int} [index=0] current index in digits array
 * @returns {string[]}
 */
function getAllExpressions(digits, expression, index) {
  expression = expression || '';
  index = index || 0;
  if (index === digits.length - 1) return [expression + digits.substr(index)];

  let allExpressions = [];
  for (const operator of ['+', '-', '*']) {
    allExpressions = [
      ...allExpressions,
      ...getAllExpressions(
        digits,
        expression + digits[index] + operator,
        index + 1
      ),
    ];
  }
  return allExpressions;
}
