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
