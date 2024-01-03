import { HOME_HOSTNAME } from 'utils/constants';

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
 * @param {import("../NetscriptDefinitions").ReactNode} content
 * @param {[Object.<string, string|number>]} style
 * @returns {import("../NetscriptDefinitions").ReactElement}
 */
export function createReactElement(content, style) {
  return React.createElement('div', { style: style ?? {} }, content);
}
