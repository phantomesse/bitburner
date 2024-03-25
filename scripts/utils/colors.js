/**
 * Gets the default color for hacking.
 *
 * @param {NS} ns
 * @returns {string} hex string starting with '#'
 */
export function getHackColor(ns) {
  return ns.ui.getTheme().hack;
}
