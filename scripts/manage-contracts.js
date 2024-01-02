import { getServers } from 'database/servers';
import { HOME_HOSTNAME } from 'utils';

/**
 * Manages contracts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getServers(ns);
  for (const server of servers) {
    const contracts = ns.ls(server.hostname, '.cct');
    for (const contract of contracts) {
      ns.tprintf(
        'home; ' +
          getPath(ns, server.hostname)
            .map(hostname => `connect ${hostname};`)
            .join(' ') +
          ` run ${contract}`
      );
    }
  }
}

/**
 * @param {NS} ns
 * @param {string} targetHostname to connect to
 * @param {[string[]]} pathThusFar
 * @returns {string[]} array of hostnames starting from the one closest to home
 */
function getPath(ns, targetHostname, pathThusFar) {
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
