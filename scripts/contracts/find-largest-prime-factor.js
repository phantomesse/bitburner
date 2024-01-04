/**
 * Find Largest Prime Factor
 *
 * A prime factor is a factor that is a prime number. What is the largest prime factor of 301829830?
 *
 * @param {number} input
 */
export default function findLargestPrimeFactor(input) {
  for (let i = input / 2; i > 0; i--) {
    if (input % i !== 0) continue; // Not a factor.
    if (isPrime(i)) return i;
  }
}

/** @type {Object.<number, boolean>}*/
const NUMBER_TO_IS_PRIME = { 1: true, 2: true, 3: true };

/**
 * Checks whether a number is prime and records it into the `NUMBER_TO_IS_PRIME`
 * map.
 *
 * @param {number} number
 */
function isPrime(number) {
  if (number in NUMBER_TO_IS_PRIME) return NUMBER_TO_IS_PRIME[number];

  let isPrime = true;

  for (let i = 2; i < number / 2; i++) {
    if (number % i === 0) {
      isPrime = false;
      break;
    }
  }

  NUMBER_TO_IS_PRIME[number] = isPrime;
  return isPrime;
}
