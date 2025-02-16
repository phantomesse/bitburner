/**
 * Find Largest Prime Factor
 *
 * A prime factor is a factor that is a prime number. What is the largest prime
 * factor of 494222292?
 *
 * @param {number} input
 * @returns {number}
 */
export function solveFindLargestPrimeFactor(input) {
  if (isPrime(input)) return input;

  for (let i = Math.floor(Math.sqrt(input)); i > 1; i--) {
    if (input % i !== 0) continue;
    if (isPrime(input / i)) return input / i;
    if (isPrime(i)) return i;
  }
  return 1;
}

const numberToIsPrimeMap = {};

/**
 * @param {number} number
 * @returns {boolean} whether number is prime or not
 */
function isPrime(number) {
  if (number in numberToIsPrimeMap) return numberToIsPrimeMap[number];

  for (let i = Math.floor(Math.sqrt(number)); i > 1; i--) {
    if (number % i === 0) {
      numberToIsPrimeMap[number] = false;
      return false;
    }
  }
  numberToIsPrimeMap[number] = true;
  return true;
}
