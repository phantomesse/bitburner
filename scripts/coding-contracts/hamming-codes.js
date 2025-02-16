// HammingCodes: Integer to Encoded Binary
//
// You are given the following decimal value:
// 251127447325
//
// Convert it to a binary representation and encode it as an 'extended Hamming code'.
// The number should be converted to a string of '0' and '1' with no leading zeroes.
// A parity bit is inserted at position 0 and at every position N where N is a power of 2.
// Parity bits are used to make the total number of '1' bits in a given set of data even.
// The parity bit at position 0 considers all bits including parity bits.
// Each parity bit at position 2^N alternately considers 2^N bits then ignores 2^N bits, starting at position 2^N.
// The endianness of the parity bits is reversed compared to the endianness of the data bits:
// Data bits are encoded most significant bit first and the parity bits encoded least significant bit first.
// The parity bit at position 0 is set last.
//
// Examples:
//
// 8 in binary is 1000, and encodes to 11110000 (pppdpddd - where p is a parity bit and d is a data bit)
// 21 in binary is 10101, and encodes to 1001101011 (pppdpdddpd)
//
// For more information on the 'rule' of encoding, refer to Wikipedia (https://wikipedia.org/wiki/Hamming_code) or the 3Blue1Brown videos on Hamming Codes. (https://youtube.com/watch?v=X8jsijhllIA)
