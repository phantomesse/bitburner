/**
 * Generate IP Addresses
 *
 * Given the following string containing only digits, return an array with all
 * possible valid IP address combinations that can be created from the string:
 *
 * 101168721
 *
 * Note that an octet cannot begin with a '0' unless the number itself is
 * actually 0. For example, '192.168.010.1' is not a valid IP.
 *
 * Examples:
 *
 * 25525511135 -> ["255.255.11.135", "255.255.111.35"]
 * 1938718066 -> ["193.87.180.66"]
 *
 * @param {string} digits
 */
export default function generateIPAddresses(digits) {
  // IP Address consists of [A, B, C, D] where each part >=0 && <= 255.
  const ipAddresses = [];

  const possibleAs = getValidParts(digits.substring(0, 3));

  for (const a of possibleAs) {
    const possibleBs = getValidParts(digits.substring(a.length, a.length + 3));

    for (const b of possibleBs) {
      const possibleCs = getValidParts(
        digits.substring(a.length + b.length, a.length + b.length + 3)
      );

      for (const c of possibleCs) {
        const d = digits.substring(a.length + b.length + c.length);
        if (d.length > 3) continue;
        if (d.startsWith('0') && d.length > 1) continue;
        if (parseInt(d) > 255) continue;

        ipAddresses.push([a, b, c, d].join('.'));
      }
    }
  }

  return ipAddresses;
}

/**
 *
 * @param {string} digits with length <= 3
 * @returns {string[]} parts
 */
function getValidParts(digits) {
  if (digits.startsWith('0')) return ['0'];
  const parts = [digits.substring(0, 1), digits.substring(0, 2)];
  if (digits.length === 3 && parseInt(digits) <= 255) parts.push(digits);
  return parts;
}
