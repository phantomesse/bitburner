/**
 * HammingCodes: Integer to encoded Binary
 *
 * You are given the following decimal Value:
 * 141796026138541
 *
 * Convert it into a binary string and encode it as a 'Hamming-Code'. eg:
 * Value 8 will result into binary '1000', which will be encoded with the
 * pattern 'pppdpddd', where p is a paritybit and d a databit, or '10101'
 * (Value 21) will result into (pppdpdddpd) '1001101011'.
 *
 * NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit.
 * NOTE 2: You should watch the HammingCode-video from 3Blue1Brown, which
 * explains the 'rule' of encoding, including the first Index parity-bit
 * mentioned on the first note.
 *
 * Now the only one rule for this encoding:
 * It's not allowed to add additional leading '0's to the binary value
 * That means, the binary value has to be encoded as it is
 *
 * @param {number} input
 * @returns {string}
 */
export function hammingCodesIntegerToEncodedBinary(input) {
  return '';
}

/**
 * HammingCodes: Encoded Binary to Integer
 *
 * You are given the following encoded binary String:
 * '0111110100011011111010000001011100'
 * Treat it as a Hammingcode with 1 'possible' error on an random Index.
 * Find the 'possible' wrong bit, fix it and extract the decimal value, which is
 * hidden inside the string.
 *
 * Note: The length of the binary string is dynamic, but it's encoding/decoding
 * is following Hammings 'rule'
 *
 * Note 2: Index 0 is an 'overall' parity bit. Watch the Hammingcode-video from
 * 3Blue1Brown for more information
 *
 * Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an
 * altered Bit 😉
 * Extranote for automation: return the decimal value as a string
 *
 * @param {string} input
 * @returns {string}
 */
export function hammingCodesEncodedBinaryToInteger(input) {
  return '';
}
