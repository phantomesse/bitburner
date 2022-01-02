import { Alignment, RowColor, printTable } from '/utils/table.js';
import { formatNumber } from '/utils/format.js';
import { sort } from '/utils/misc.js';
import {
  getAllServerNames,
  getFreeRam,
  PURCHASED_SERVER_PREFIX,
} from '/utils/servers.js';

const SERVER_NAME_COLUMN_HEADER = 'Server Name';
const FREE_RAM_COLUMN_HEADER = 'Free RAM';
const MAX_RAM_COLUMN_HEADER = 'Max RAM';

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
  sort(servers, server => server.maxRam);
  sort(servers, server => server.isPurchased, true);

  const totalFreeRam = servers
    .map(server => server.freeRam)
    .reduce((a, b) => a + b);
  const totalMaxRam = servers
    .map(server => server.maxRam)
    .reduce((a, b) => a + b);

  printTable(
    ns,
    {
      [FREE_RAM_COLUMN_HEADER]: Alignment.RIGHT,
      [MAX_RAM_COLUMN_HEADER]: Alignment.RIGHT,
    },
    servers.map(server => ({
      [SERVER_NAME_COLUMN_HEADER]: server.name,
      [FREE_RAM_COLUMN_HEADER]: formatNumber(server.freeRam) + ' GB',
      [MAX_RAM_COLUMN_HEADER]: formatNumber(server.maxRam) + ' GB',
      rowColor: server.isPurchased ? RowColor.NORMAL : RowColor.WARN,
    })),
    [
      {
        [SERVER_NAME_COLUMN_HEADER]: 'Total free RAM',
        [FREE_RAM_COLUMN_HEADER]: formatNumber(totalFreeRam) + ' GB',
        [MAX_RAM_COLUMN_HEADER]: formatNumber(totalMaxRam) + ' GB',
      },
    ]
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
    this.maxRam = ns.getServerMaxRam(serverName);
    this.isPurchased = serverName.startsWith(PURCHASED_SERVER_PREFIX);
  }
}
