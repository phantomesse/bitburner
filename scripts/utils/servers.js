/** Utils for servers. */

export const HOME_SERVER_NAME = 'home';
export const PURCHASED_SERVER_PREFIX = 'lauren';

/**
 * Retrieves all servers including personal servers and {@link HOME_SERVER_NAME}.
 *
 * @example getAllServers(ns)
 * @param {import('../index').NS } ns
 * @param {string} [root] name of server to start getting server names from
 * @param {string} [parent] name of parent of the root server (where we came
 *                          from)
 * @returns {string[]} names of all servers including {@link HOME_SERVER_NAME}
 */
export function getAllServerNames(ns, root, parent) {
  const children = ns.scan(root).filter(child => child !== parent);
  const servers = [...children];
  for (const child of children) {
    servers.push(...getAllServerNames(ns, child, root));
  }
  return [...new Set(servers)];
}

/**
 * Gets the connection path to a server.
 *
 * @example getPath(ns, 'silver-helix')
 * @param {import('../index').NS} ns
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

/**
 * @param {import('../index').NS} ns
 * @param {string} serverName
 * @returns {number} GB of free RAM
 */
export function getFreeRam(ns, serverName) {
  if (!ns.hasRootAccess(serverName)) return 0;
  return ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName);
}
