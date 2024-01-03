export const HOME_HOSTNAME = 'home';

/** One second in milliseconds. */
export const ONE_SECOND = 1000;

/** One minute in milliseconds. */
export const ONE_MINUTE = ONE_SECOND * 60;

/**
 * Gets all hostnames available.
 *
 * @param {NS} ns
 * @param {[string]} rootHostname
 * @param {[string]} previousHostname
 * @returns {string[]} all hostnames
 */
export function getAllHostnames(ns, rootHostname, previousHostname) {
  const childrenHostnames = ns
    .scan(rootHostname)
    .filter(hostname => hostname !== previousHostname);
  const allHostnames = [...childrenHostnames];
  for (const childHostname of childrenHostnames) {
    allHostnames.push(...getAllHostnames(ns, childHostname, rootHostname));
  }
  return [...new Set(allHostnames)];
}

/**
 * @param {NS} ns
 * @param {string} targetHostname to connect to
 * @param {[string[]]} pathThusFar
 * @returns {string[]} array of hostnames starting from the one closest to home
 */
export function getPath(ns, targetHostname, pathThusFar) {
  pathThusFar = pathThusFar ?? [];
  if (targetHostname === HOME_HOSTNAME) return pathThusFar;

  const adjacentHostnames = ns
    .scan(targetHostname)
    .filter(adjacentHostname => adjacentHostname !== pathThusFar[0]);
  if (adjacentHostnames.length === 0) return [];

  for (const adjacentHostname of adjacentHostnames) {
    const path = getPath(ns, adjacentHostname, [
      targetHostname,
      ...pathThusFar,
    ]);
    if (path.length > 0) return path;
  }
  return []; // Should not reach here.
}

/**
 * @param {NS} ns
 * @param {number} amount
 * @returns {string} e.g. "$123.45"
 */
export function formatMoney(ns, amount) {
  return '$' + ns.formatNumber(amount, 2);
}

/**
 * @param {import("../NetscriptDefinitions").ReactNode} content
 * @param {[Style]} style
 * @returns {import("../NetscriptDefinitions").ReactElement}
 */
export function createReactElement(content, style) {
  return React.createElement('div', { style: style ?? {} }, content);
}

/**
 * @typedef Style
 * @property {[string]} background
 * @property {[string]} color
 * @property {['flex'|'grid']} display
 * @property {['left'|'center'|'right']} textAlign
 */
