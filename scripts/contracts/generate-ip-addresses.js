/**
 * Generate IP Addresses
 * 
 * Given the following string containing only digits, return an array with all
 * possible valid IP address combinations that can be created from the string:
 * 
 * 68917078
 * 
 * Note that an octet cannot begin with a '0' unless the number itself is
 * actually 0. For example, '192.168.010.1' is not a valid IP.
 * Examples:

25525511135 -> [255.255.11.135, 255.255.111.35]
1938718066 -> [193.87.180.66]
68917078 -> [68.91.70.78, 68.9.170.78, 6.89.170.78]
 */

const input = '25525511135'; //'68917078';

/**
 * @param {string} input
 * @returns {string[]}
 */
function getIpAddresses(input) {
  const possibleFirstSections = [];
  input;
}
