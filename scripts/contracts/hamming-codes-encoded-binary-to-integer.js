/**
 * HammingCodes: Encoded Binary to Integer
 *
 * You are given the following encoded binary string:
 * '00000010100000011101110100000110'
 *
 * Treat it as an extended Hamming code with 1 'possible' error at a random
 * index.
 *
 * Find the 'possible' wrong bit, fix it and extract the decimal value, which is
 * hidden inside the string.
 *
 * Note: The length of the binary string is dynamic, but its encoding/decoding
 * follows Hamming's 'rule'
 *
 * Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from
 * 3Blue1Brown for more information
 *
 * Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an
 * altered Bit 😉
 *
 * Note: The endianness of the encoded decimal value is reversed in relation to
 * the endianness of the Hamming code. Where the Hamming code is expressed as
 * little-endian (LSB at index 0), the decimal value encoded in it is expressed
 * as big-endian (MSB at index 0).
 *
 * Extra note for automation: return the decimal value as a string
 *
 * @param {string} encodedBinaryString
 */
export default function hammingCodesEncodedBinaryToInteger(
  encodedBinaryString
) {}
