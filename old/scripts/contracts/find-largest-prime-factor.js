/**
 * Find Largest Prime Factor
 *
 * A prime factor is a factor that is a prime number. What is the largest prime
 * factor of the input?
 *
 * @param {number} input
 * @returns {number} largest prime factor
 */
export function findLargestPrimeFactor(input) {
  /** @type {Object.<number, boolean>} */
  const cachedPrimeNumberMap = {};

  const primes = [];
  for (let i = 1; i <= input; i++) {
    if (input % i !== 0) continue;
    if (_isPrime(i, cachedPrimeNumberMap)) primes.push(i);
  }
  return primes.slice(-1)[0];
}

/**
 * Checks if a number is prime.
 *
 * @param {number} number
 * @param {Object.<number, boolean>} cachedPrimeNumberMap
 */
function _isPrime(number, cachedPrimeNumberMap) {
  if (number in cachedPrimeNumberMap) return cachedPrimeNumberMap[number];
  for (let i = 2; i < number; i++) {
    if (number % i === 0) {
      cachedPrimeNumberMap[number] = false;
      return false;
    }
  }
  cachedPrimeNumberMap[number] = true;
  return true;
}
