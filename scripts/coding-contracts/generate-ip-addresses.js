/**
 * Generate IP Addresses
 *
 * Given the following string containing only digits, return an array with all
 * possible valid IP address combinations that can be created from the string:
 *
 * 2101824513
 *
 * Note that an octet cannot begin with a '0' unless the number itself is
 * exactly '0'. For example, '192.168.010.1' is not a valid IP.
 *
 * Examples:
 *
 * 25525511135 -> ["255.255.11.135", "255.255.111.35"]
 * 1938718066 -> ["193.87.180.66"]
 *
 * @param {string} input
 * @returns {string[]}
 */
export function solveGenerateIpAddresses(input) {
  return getIpAddresses(input);
}

/**
 * @param {string} string
 * @param {string = []} ipAddressThusFar
 * @returns {string[]}
 */
function getIpAddresses(string, ipAddressThusFar = []) {
  if (string === '') return [ipAddressThusFar.join('.')];
  if (ipAddressThusFar.length === 4) return [];

  const octetList = [
    string.substring(0, 1),
    string.substring(0, 2),
    string.substring(0, 3),
  ].filter(isValidOctet);
  if (octetList.length === 0) return [ipAddressThusFar.join('')];

  const ipAddresses = [];
  for (const octet of octetList) {
    ipAddresses.push(
      ...getIpAddresses(string.substring(octet.length), [
        ...ipAddressThusFar,
        octet,
      ])
    );
  }

  return [...new Set(ipAddresses)];
}

/**
 * @param {string} octet
 * @returns {boolean}
 */
function isValidOctet(octet) {
  const number = parseInt(octet);
  if (number !== 0 && octet.startsWith('0')) return false;
  return number >= 0 && number <= 255;
}
