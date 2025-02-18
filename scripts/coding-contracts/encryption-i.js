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
 *   ["DEBUG MACRO TABLE FLASH MODEM", 10]
 * The first element is the plaintext, the second element is the left shift
 * value.
 *
 * Return the ciphertext as uppercase string. Spaces remains the same.
 * @param {[string, number]} input
 * @returns {string}
 */
export function solveEncryptionI(input) {
  const message = input[0];
  const shift = input[1];

  const alphabet = [];
  for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
    alphabet.push(String.fromCharCode(i));
  }

  return message
    .split('')
    .map((letter) => {
      const index = alphabet.indexOf(letter);
      if (index === -1) return letter;
      let shiftedIndex = (index - shift) % alphabet.length;
      if (shiftedIndex < 0) shiftedIndex += alphabet.length;
      return alphabet[shiftedIndex];
    })
    .join('');
}
