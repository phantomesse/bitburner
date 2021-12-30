/** Utils for servers. */

export const HOME_SERVER_NAME = 'home';
export const PURCHASED_SERVER_PREFIX = 'lauren';

/**
 * Retrieves all servers including personal servers and {@link HOME_SERVER_NAME}.
 *
 * @example getAllServers(ns)
 * @param {import('../..').NS } ns
 * @param {string} [root] name of server to start getting server names from
 * @param {string} [parent] name of parent of the root server (where we came
 *                          from)
 * @returns {string[]} names of all servers including {@link HOME_SERVER_NAME}
 */
export function getAllServerNames(ns, root, parent) {
  const children = ns.scan(root).filter(child => child !== parent);
  let servers = [...children];
  for (const child of children) {
    servers = [...new Set([...servers, ...getAllServerNames(ns, child, root)])];
  }
  return servers;
}

/**
 * Gets the connection path to a server.
 *
 * @example getPath(ns, 'silver-helix')
 * @param {import('../..').NS } ns
 * @param {string} server server to get path to
 * @param {string} [root] name of server to start getting server names from
 * @param {string} [parent] name of parent of the root server (where we came
 *                          from)
 * @returns {string[]} connection to server where the last item is the name of
 *                     the server to get the path to (e.g. if the server is
 *                     silver-helix, then the path is
 *                     ["foodnstuff","zer0","silver-helix"])
 */
export function getPath(ns, server, root, parent) {
  if (parent === undefined) parent = 'home';
  const children = ns.scan(root).filter(child => child !== parent);
  if (children.includes(server)) return [server];
  for (const child of children) {
    const path = getPath(ns, server, child, root);
    if (path.length > 0) return [child, ...path];
  }
  return [];
}

export async function main(ns) {
  ns.tprint(getPath(ns, 'silver-helix'));
}
