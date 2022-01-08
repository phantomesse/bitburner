/**
 * Generate IP Addresses
 *
 * Given the following string containing only digits, return an array with all
 * possible valid IP address combinations that can be created from the input.
 *
 * Note that an octet cannot begin with a '0' unless the number itself is
 * actually 0. For example, '192.168.010.1' is not a valid IP.
 *
 * @param {string} input
 * @returns {string[]}
 */
export function generateIpAddresses(input) {
  return _getAddresses(input);
}

/**
 * @param {string} str
 * @param {number} [depth]
 * @returns {string[]}
 */
function _getAddresses(str, depth) {
  if (depth === undefined) depth = 0;
  if (depth === 4) return [];
  const beginningSections = _getBeginningSections(str);
  const addresses = [];
  for (const beginningSection of beginningSections) {
    const restOfStr = str.substring(beginningSection.toString().length);
    if (restOfStr === '') {
      addresses.push(...beginningSections);
    } else {
      const addressVariants = _getAddresses(restOfStr, depth + 1);
      for (const variant of addressVariants) {
        if (variant.replaceAll('.', '') === restOfStr) {
          addresses.push(beginningSection + '.' + variant);
        }
      }
    }
  }
  return [...new Set(addresses)];
}

/**
 * A section is the first 1-3 characters of the {@link str} where there cannot
 * be a leading zero nor can there be a leading zero after the section. The
 * section must also be a number between 0 and 255.
 *
 * @param {string} str
 */
function _getBeginningSections(str) {
  if (str.length === 0) return [];
  return [1, 2, 3]
    .filter(length => length === 1 || str[0] !== '0') // cannot be a leading zero after the section
    .map(length => parseInt(str.substring(0, length)))
    .filter(section => section >= 0 && section <= 255)
    .map(section => section.toString());
}
