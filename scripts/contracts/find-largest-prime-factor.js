/**
 * Find Largest Prime Factor
 *
 * A prime factor is a factor that is a prime number. What is the largest prime factor of 383337599?
 *
 * @param {int} input
 * @returns {int} largest prime factor
 */
export function findLargestPrimeFactor(input) {
  for (let i = input; i > 1; i--) {
    if (input % i !== 0) continue;
    if (isPrime(i)) return i;
  }
  return 1;
}

const cachedNumberToIsPrimeMap = { 1: true, 2: true, 3: true, 4: false };

/**
 * Checks if a number is prime.
 *
 * @param {int} number
 * @returns {boolean} true if is prime
 */
function isPrime(number) {
  if (number in cachedNumberToIsPrimeMap) {
    return cachedNumberToIsPrimeMap[number];
  }
  for (let i = number - 1; i > 1; i--) {
    if (number % i === 0) {
      cachedNumberToIsPrimeMap[number] = false;
      return false;
    }
  }
  cachedNumberToIsPrimeMap[number] = true;
  return true;
}
