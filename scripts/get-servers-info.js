import { sort } from '/utils/misc.js';
import {
  formatNumber,
  formatTable,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
} from '/utils/format.js';
import { getAllServerNames } from '/utils/servers.js';
import {
  isHackable,
  GROW_SCRIPT,
  HACK_SCRIPT,
  WEAKEN_SCRIPT,
} from '/utils/hacking.js';

const SERVER_NAME_COLUMN_HEADER = 'Server name';
const GROWING_COLUMN_HEADER = 'Growing';
const WEAKENING_COLUMN_HEADER = 'Weakening';
const HACKING_COLUMN_HEADER = 'Hacking';
const MAX_RAM_COLUMN_HEADER = 'Max ram';
const USED_RAM_COLUMN_HEADER = 'Used ram';
const FREE_RAM_COLUMN_HEADER = 'Free ram';

/**
 * Prints out information about all servers that we have root access to and
 * which scripts they're running.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const servers = getAllServerNames(ns)
    .map(serverName => new Server(ns, serverName))
    .filter(server => server.hasRootAccess);
  sort(servers, server => server.name);
  sort(servers, server => server.maxRam, true);
  sort(servers, server => server.isPurchased, true);

  const hackableServerNames = servers
    .filter(server => isHackable(ns, server.name))
    .map(server => server.name);
  sort(hackableServerNames, serverName => serverName);
  for (const server of servers) {
    for (const targetServerName of hackableServerNames) {
      const growingScript = ns.getRunningScript(
        GROW_SCRIPT,
        server.name,
        targetServerName,
        1
      );
      if (growingScript !== null) {
        server.growing.push({
          targetServerName: targetServerName,
          threadCount: growingScript.threads,
        });
      }

      const weakeningScript = ns.getRunningScript(
        WEAKEN_SCRIPT,
        server.name,
        targetServerName,
        1
      );
      if (weakeningScript !== null) {
        server.weakening.push({
          targetServerName: targetServerName,
          threadCount: weakeningScript.threads,
        });
      }

      const hackingScript = ns.getRunningScript(
        HACK_SCRIPT,
        server.name,
        targetServerName,
        1
      );
      if (hackingScript !== null) {
        server.hacking.push({
          targetServerName: targetServerName,
          threadCount: hackingScript.threads,
        });
      }
    }
  }

  const table = formatTable(
    {
      [SERVER_NAME_COLUMN_HEADER]: LEFT_ALIGNMENT,
      [GROWING_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [WEAKENING_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [HACKING_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [MAX_RAM_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [USED_RAM_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [FREE_RAM_COLUMN_HEADER]: RIGHT_ALIGNMENT,
    },
    ...servers.map(server => [server.getTableRow()])
  );
  ns.tprint(table);
}

class Server {
  /**
   * @param {import('..').NS} ns
   * @param {string} serverName
   */
  constructor(ns, serverName) {
    this.ns = ns;
    this.name = serverName;

    const server = ns.getServer(serverName);
    this.hasRootAccess = server.hasAdminRights;
    if (!this.hasRootAccess) return;

    this.isPurchased = server.purchasedByPlayer;

    // RAM information.
    this.maxRam = server.maxRam;
    this.usedRam = server.ramUsed;
    this.freeRam = this.maxRam - this.usedRam;

    this.growing = [];
    this.weakening = [];
    this.hacking = [];
  }

  _formatScripts(scripts) {
    if (scripts.length === 0) return '--';
    sort(scripts, script => script.threadCount, true);
    return scripts
      .map(
        script =>
          script.targetServerName +
          ` (${formatNumber(script.threadCount, true)})`
      )
      .join('\n');
  }

  getTableRow() {
    return {
      [SERVER_NAME_COLUMN_HEADER]: this.name,
      [GROWING_COLUMN_HEADER]: this._formatScripts(this.growing),
      [WEAKENING_COLUMN_HEADER]: this._formatScripts(this.weakening),
      [HACKING_COLUMN_HEADER]: this._formatScripts(this.hacking),
      [MAX_RAM_COLUMN_HEADER]: formatNumber(this.maxRam, true),
      [USED_RAM_COLUMN_HEADER]: formatNumber(this.usedRam, true),
      [FREE_RAM_COLUMN_HEADER]: formatNumber(this.freeRam, true),
    };
  }
}
