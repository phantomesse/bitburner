import { getAllServers } from './utils.js';

/**
 * List all the files on each server.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const servers = [...getAllServers(ns)].filter(
    server => server !== 'home' && !ns.getPurchasedServers().includes(server)
  );
  for (const server of servers) {
    const files = ns.ls(server).filter(fileName => !fileName.endsWith('.js'));
    if (files.length > 0) ns.tprint(`${server}: ${files}`);
  }
}
