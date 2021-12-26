import { getAllServerNames } from './utils.js';
import { getPathCommands } from './get-path.js';

/**
 * List all the files on each server.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const serverNames = [...getAllServerNames(ns)].filter(
    server => server !== 'home' && !ns.getPurchasedServers().includes(server)
  );

  const serverPrintBlocks = [];
  for (const server of serverNames) {
    const files = ns.ls(server).filter(fileName => !fileName.endsWith('.js'));
    if (files.length > 0) {
      serverPrintBlocks.push(
        `${server}\n${getPathCommands(ns, server)}\n${files.join('\t')}`
      );
    }
  }
  ns.tprint('\n' + serverPrintBlocks.join('\n\n'));
}
