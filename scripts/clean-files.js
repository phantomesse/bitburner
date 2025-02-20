import { getAllServerNames, HOME_SERVER_NAME } from 'utils/server';

/**
 * Remove `.js` files from all servers and remove `.cct` files from home server.
 *
 * After doing this, make sure to push all files to server from the VSCode
 * Bitburner extension.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Remove `.cct` files from home server.
  const testContractFileNames = ns.ls(HOME_SERVER_NAME, '.cct');
  for (const fileName of testContractFileNames) {
    ns.rm(fileName);
  }

  // Remove `.js` files from all servers.
  const serverNames = getAllServerNames(ns);
  for (const serverName of serverNames) {
    const jsFileNames = ns.ls(serverName, '.js');
    for (const fileName of jsFileNames) {
      ns.rm(fileName);
    }
  }
}
