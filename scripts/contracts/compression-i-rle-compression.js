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
 *     4oo55555555555mTTmmWWWWWOOlxWWggHHOll55O880000000000000kkkkkkkkkJJJJJ
 * Encode it using run-length encoding with the minimum possible output length.
 *
 * Examples:
 *     aaaaabccc            ->  5a1b3c
 *     aAaAaA               ->  1a1A1a1A1a1A
 *     111112333            ->  511233
 *     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
 *
 * @param {string} input
 */
export default function compressionIRLECompression(input) {
  let compressed = '';
  let currentLetter, currentCount;
  for (let i = 0; i < input.length; i++) {
    const letter = input.charAt(i);

    if (i === 0) {
      currentLetter = letter;
      currentCount = 1;
      continue;
    }

    if (currentLetter !== letter || currentCount === 9) {
      compressed += `${currentCount}${currentLetter}`;
      currentLetter = letter;
      currentCount = 1;
      continue;
    }

    currentCount++;
  }
  compressed += `${currentCount}${currentLetter}`;
  return compressed;
}
