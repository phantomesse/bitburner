/**
 * Compression I: RLE Compression
 *
 * Run-length encoding (RLE) is a data compression technique which encodes data
 * as a series of runs of a repeated single character. Runs are encoded as a
 * length, followed by the character itself. Lengths are encoded as a single
 * ASCII digit; runs of 10 characters or more are encoded by splitting them into
 * multiple runs.
 *
 * You are given the following input string:
 *     6OOOOOOOOOOOOOOxx77geffooIIpVVVkkbAAnnnnnnnnnnnnllptttttrmwwkkkkkkkkkkkkk
 * Encode it using run-length encoding with the minimum possible output length.
 *
 * Examples:
 *
 *     aaaaabccc            ->  5a1b3c
 *     aAaAaA               ->  1a1A1a1A1a1A
 *     111112333            ->  511233
 *     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
 *
 * @param {string} input
 * @returns {string}
 */
export function solveCompressionI(input) {
  let compression = '';

  for (let i = 0; i < input.length; i++) {
    const character = input.charAt(i);

    let count = 1;
    while (input.charAt(i + 1) === character && count < 9) {
      i++;
      count++;
    }
    compression += `${count}${character}`;
  }

  return compression;
}
