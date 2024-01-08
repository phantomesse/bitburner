/**
 * Encryption I: Caesar Cipher
 *
 * Caesar cipher is one of the simplest encryption technique. It is a type of
 * substitution cipher in which each letter in the plaintext is replaced by a
 * letter some fixed number of positions down the alphabet. For example, with a
 * left shift of 3, D would be replaced by A, E would become B, and A would
 * become X (because of rotation).
 *
 * You are given an array with two elements:
 *   ["ENTER MOUSE TRASH PASTE DEBUG", 1]
 * The first element is the plaintext, the second element is the left shift value.
 *
 * Return the ciphertext as uppercase string. Spaces remains the same.
 *
 * @param {(string | number)[]} input [plain text, left shift value]
 * @returns {string} cipher
 */
export default function encryptionICaesarCipher(input) {
  const [plainText, leftShift] = input;
  const charCodeForA = 'A'.charCodeAt(0);
  const charCodeForZ = 'Z'.charCodeAt(0);

  // Convert every character in plain text to a char code and shift it by left
  // shift value.
  /** @type {number[]} */ const shiftedCharCodes = [];
  for (let i = 0; i < plainText.length; i++) {
    const charCode = plainText.charCodeAt(i);

    // Ignore characters that are outside of [A, Z].
    if (charCode < charCodeForA || charCode > charCodeForZ) {
      shiftedCharCodes.push(charCode);
      continue;
    }

    let shiftedCharCode;
    if (charCode - leftShift < charCodeForA) {
      shiftedCharCode =
        charCodeForZ - (leftShift - (charCode - charCodeForA)) + 1;
    } else {
      shiftedCharCode = charCode - leftShift;
    }
    shiftedCharCodes.push(shiftedCharCode);
  }

  return shiftedCharCodes
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}
