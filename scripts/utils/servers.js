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
 * @typedef {@type string[]} Path
 *
 * Gets a list of all paths to hosts.
 *
 * @param {NS} ns
 * @param {string} rootHostname
 * @param {[Path]} path
 * @returns {Path[]} all paths including home as the first server
 */
export function getAllPaths(ns, rootHostname, path) {
  path = path ?? [];

  const childrenHostnames = ns
    .scan(rootHostname)
    .filter(hostname => hostname !== path[path.length - 1]);
  if (childrenHostnames.length === 0) return [];

  const allPaths = [];
  for (const childHostname of childrenHostnames) {
    allPaths.push([...path, rootHostname, childHostname]);
    allPaths.push(...getAllPaths(ns, childHostname, [...path, rootHostname]));
  }
  return allPaths;
}
