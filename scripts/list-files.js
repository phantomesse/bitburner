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

  const serverPrintBlocks = [];
  for (const server of servers) {
    const files = ns.ls(server).filter(fileName => !fileName.endsWith('.js'));
    if (files.length > 0) {
      serverPrintBlocks.push(
        `${server}\n${getPath(ns, server)
          .map(path => `connect ${path}`)
          .join('; ')}\n${files.join('\t')}`
      );
    }
  }
  ns.tprint('\n' + serverPrintBlocks.join('\n\n'));
}

/**
 * @param {import('..').NS } ns
 * @param {string} server Server to get path to.
 * @param {string} [root]
 * @param {string} [parent]
 * @returns {Set<string>}
 */
function getPath(ns, server, root, parent) {
  if (parent === undefined) parent = 'home';
  const children = ns.scan(root).filter(child => child != parent);
  if (children.includes(server)) return [server];
  for (const child of children) {
    const path = getPath(ns, server, child, root);
    if (path.length > 0) return [child, ...path];
  }
  return [];
}
