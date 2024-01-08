/**
 * Encryption II: Vigenère Cipher
 *
 * Vigenère cipher is a type of polyalphabetic substitution. It uses the
 * Vigenère square to encrypt and decrypt plaintext with a keyword.
 *
 *   Vigenère square:
 *          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
 *        +----------------------------------------------------
 *      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
 *      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
 *      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
 *      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
 *      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
 *                 ...
 *      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
 *      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y
 *
 * For encryption each letter of the plaintext is paired with the corresponding
 * letter of a repeating keyword. For example, the plaintext DASHBOARD is
 * encrypted with the keyword LINUX:
 *    Plaintext: DASHBOARD
 *    Keyword:   LINUXLINU
 * So, the first letter D is paired with the first letter of the key L.
 * Therefore, row D and column L of the Vigenère square are used to get the
 * first cipher letter O. This must be repeated for the whole ciphertext.
 *
 * You are given an array with two elements:
 *   ["POPUPENTERMOUSEINBOXMACRO", "BLOGGER"]
 * The first element is the plaintext, the second element is the keyword.
 *
 * Return the ciphertext as uppercase string.
 *
 * @param {[string, string]} input
 */
export default function encryptionIIVigenereCipher(input) {
  const cipher = createCipher();

  // Make the keyword match the length of the plain text.
  const plainText = input[0];
  let keyword = input[1];
  while (keyword.length < plainText.length) {
    keyword += keyword;
  }
  keyword = keyword.substring(0, plainText.length);

  // Encrypt.
  let encryptedMessage = '';
  for (let i = 0; i < plainText.length; i++) {
    encryptedMessage += cipher[plainText[i]][keyword[i]];
  }
  return encryptedMessage;
}

/**
 * @typedef {Object.<string, Object<string, string>} Cipher
 *
 * @returns {Cipher} cipher
 */
function createCipher() {
  const charCodeAtA = 'A'.charCodeAt(0);
  const charCodeAtZ = 'Z'.charCodeAt(0);

  const alphabet = [];
  for (let i = charCodeAtA; i <= charCodeAtZ; i++) {
    alphabet.push(String.fromCharCode(i));
  }

  const cipher = {};
  for (let i = 0; i < alphabet.length; i++) {
    cipher[alphabet[i]] = {};
    const offsetAlphabet = [...alphabet.slice(i), ...alphabet.slice(0, i)];
    for (let j = 0; j < alphabet.length; j++) {
      cipher[alphabet[i]][alphabet[j]] = offsetAlphabet[j];
    }
  }
  return cipher;
}
