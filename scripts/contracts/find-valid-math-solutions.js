const OPERATORS = ['+', '-', '*'];

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
  /** @type {string} */ const digits = input[0];
  /** @type {number} */ const targetNumber = input[1];

  /**
   * Index is the index of the digit in the digits string.
   *
   * @type {string[][]}
   */
  const combinations = Array(digits.length);
  for (let i = digits.length - 1; i >= 0; i--) {
    const digit = digits.substring(i, i + 1);

    // Fill in the last slot of the combinations array.
    if (i === digits.length - 1) {
      combinations[i] = [digit];
      continue;
    }

    // Fill in the other combinations.
    combinations[i] = [];
    for (const expression of combinations[i + 1]) {
      combinations[i].push(digit + expression);
      if (
        expression.startsWith('0') &&
        expression.split(/[\+\-\*]/g)[0] !== '0'
      ) {
        continue;
      }
      OPERATORS.forEach(operator =>
        combinations[i].push(digit + operator + expression)
      );
    }
  }

  // Get valid expressions.
  return combinations[0].filter(
    expression => evaluate(expression) === targetNumber
  );
}

/**
 * @param {string} expression
 * @returns {number}
 */
function evaluate(expression) {
  // Split + and - into an array of addends.
  const addParts = expression.split('+');
  const addends = [];
  for (const addPart of addParts) {
    if (addPart.includes('-')) {
      const subtractParts = addPart.split('-');
      addends.push(subtractParts[0]);
      for (let i = 1; i < subtractParts.length; i++) {
        addends.push('-' + subtractParts[i]);
      }
    } else {
      addends.push(addPart);
    }
  }

  // Resolve multiplications within each addend and sum.
  let sum = 0;
  for (const addend of addends) {
    if (addend.includes('*')) {
      const factors = addend.split('*');
      if (factors.includes('0')) continue;
      const product = factors
        .filter(factor => factor !== '1')
        .map(factor => parseInt(factor))
        .reduce((a, b) => a * b);
      sum += product;
    } else {
      sum += parseInt(addend);
    }
  }
  return sum;
}
