import { formatTable, LEFT_ALIGNMENT, RIGHT_ALIGNMENT } from '/utils/format.js';
import { sort } from '/utils/misc.js';
import { getAllServerNames, getFreeRam } from '/utils/servers.js';

/**
 * Prints out free RAM from all servers that have any RAM.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const servers = getAllServerNames(ns)
    .map(serverName => new Server(ns, serverName))
    .filter(server => server.freeRam > 0);
  sort(servers, server => server.name);
  sort(servers, server => server.freeRam);

  const totalFreeRam = servers
    .map(server => server.freeRam)
    .reduce((a, b) => a + b);
  ns.tprint(
    formatTable(
      ns,
      servers.map(server => ({
        'Server Name': server.name,
        'Free RAM': server.freeRam.toFixed(2) + ' GB',
      })),
      {
        'Server Name': LEFT_ALIGNMENT,
        'Free RAM': RIGHT_ALIGNMENT,
      }
    ) + `\n\nTotal free RAM: ${totalFreeRam.toFixed(2)} GB`
  );
}

class Server {
  /**
   * @param {import('..').NS} ns
   * @param {string} serverName
   */
  constructor(ns, serverName) {
    this.name = serverName;
    this.freeRam = getFreeRam(ns, serverName);
  }
}
