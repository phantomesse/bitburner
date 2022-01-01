import {
  formatNumber,
  formatTable,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
} from '/utils/format.js';
import { sort } from '/utils/misc.js';
import { getAllServerNames, getFreeRam } from '/utils/servers.js';

const SERVER_NAME_COLUMN_HEADER = 'Server Name';
const FREE_RAM_COLUMN_HEADER = 'Free RAM';

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

  const table = formatTable(
    {
      [SERVER_NAME_COLUMN_HEADER]: LEFT_ALIGNMENT,
      [FREE_RAM_COLUMN_HEADER]: RIGHT_ALIGNMENT,
    },
    servers.map(server => ({
      [SERVER_NAME_COLUMN_HEADER]: server.name,
      [FREE_RAM_COLUMN_HEADER]: formatNumber(server.freeRam) + ' GB',
    })),
    [
      {
        [SERVER_NAME_COLUMN_HEADER]: 'Total free RAM',
        [FREE_RAM_COLUMN_HEADER]: formatNumber(totalFreeRam) + ' GB',
      },
    ]
  );
  ns.tprint(table);
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
