import { getAllServerNames } from './utils/servers';

/**
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const serverNames = getAllServerNames(ns);
  for (const serverName of serverNames) {
    ns.tprint(ns.getServer(serverName).organizationName);
  }

  // const symbols = ns.stock.getSymbols();
  // for (const symbol of symbols) {
  // }
}
