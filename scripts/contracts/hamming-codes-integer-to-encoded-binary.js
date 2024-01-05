/**
 * HammingCodes: Integer to Encoded Binary
 *
 * You are given the following decimal Value:
 * 223500403664
 *
 * Convert it to a binary representation and encode it as an 'extended Hamming
 * code'. Eg: Value 8 is expressed in binary as '1000', which will be encoded
 * with the pattern 'pppdpddd', where p is a parity bit and d a data bit. The
 * encoding of 8 is 11110000. As another example, '10101' (Value 21) will result
 * into (pppdpdddpd) '1001101011'.
 *
 * The answer should be given as a string containing only 1s and 0s.
 *
 * NOTE: the endianness of the data bits is reversed in relation to the
 *       endianness of the parity bits.
 *
 * NOTE: The bit at index zero is the overall parity bit, this should be set
 *       last.
 *
 * NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which
 *         explains the 'rule' of encoding, including the first index parity bit
 *         mentioned in the previous note.
 *
 * Extra rule for encoding:
 * There should be no leading zeros in the 'data bit' section
 */
