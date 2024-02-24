/**
 * Find Largest Prime Factor
 *
 * A prime factor is a factor that is a prime number. What is the largest prime factor of 301829830?
 *
 * @param {number} input
 */
export default function findLargestPrimeFactor(input) {
  const squareRoot = Math.floor(Math.sqrt(input));
  let otherPrimeFactor;
  for (let i = 1; i <= squareRoot; i++) {
    if (input % i !== 0) continue; // Not a factor.
    if (isPrime(input / i)) return input / i;
    if (isPrime(i)) otherPrimeFactor = i;
  }
  return otherPrimeFactor;
}

/** @type {Object.<number, boolean>}*/
const numberToIsPrimeMap = {
  1: true,
  2: true,
  3: true,
  5: true,
  7: true,
  11: true,
  13: true,
  17: true,
  19: true,
  23: true,
  29: true,
  31: true,
  37: true,
  41: true,
  43: true,
  47: true,
  53: true,
  59: true,
  61: true,
  67: true,
  71: true,
  73: true,
  79: true,
  83: true,
  89: true,
  97: true,
};

/**
 * Checks whether a number is prime and records it into the `NUMBER_TO_IS_PRIME`
 * map.
 *
 * @param {number} number
 */
function isPrime(number) {
  if (number in numberToIsPrimeMap) return numberToIsPrimeMap[number];

  let isPrime = true;

  for (let i = 2; i < Math.sqrt(number); i++) {
    if (number % i === 0) {
      isPrime = false;
      break;
    }
  }

  numberToIsPrimeMap[number] = isPrime;
  return isPrime;
}
