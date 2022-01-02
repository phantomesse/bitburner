import {
  formatMoney,
  formatNumber,
  formatPercent,
  formatTable,
  formatTime,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
} from '/utils/format.js';
import {
  getHackingHeuristic,
  GROW_SCRIPT,
  HACK_SCRIPT,
  isHackable,
  WEAKEN_SCRIPT,
} from '/utils/hacking.js';
import { sort } from '/utils/misc.js';
import { getAllServerNames } from '/utils/servers.js';

const SERVER_NAME_COLUMN_HEADER = 'Server name';
const AVAILABLE_MONEY_COLUMN_HEADER = 'Available money';
const SECURITY_LEVEL_COLUMN_HEADER = 'Security level';
const HACK_CHANCE_COLUMN_HEADER = 'Hack chance';
const BEING_GROWN_COLUMN_HEADER = 'Growing by';
const BEING_WEAKENED_COLUMN_HEADER = 'Weakening by';
const BEING_HACKED_COLUMN_HEADER = 'Hacked by';

/**
 * Prints out information about all hackable servers.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const allServerNames = getAllServerNames(ns);

  const hackableServers = allServerNames
    .filter(serverName => isHackable(ns, serverName))
    .map(serverName => new Server(ns, serverName));
  sort(hackableServers, server => getHackingHeuristic(ns, server.name));

  const rootAccessServerNames = allServerNames.filter(serverName =>
    ns.hasRootAccess(serverName)
  );
  for (const serverName of rootAccessServerNames) {
    for (const targetServer of hackableServers) {
      const growingScript = ns.getRunningScript(
        GROW_SCRIPT,
        serverName,
        targetServer.name,
        1
      );
      if (growingScript !== null) {
        targetServer.beingGrownBy.push({
          serverName: serverName,
          threadCount: growingScript.threads,
        });
      }

      const weakeningScript = ns.getRunningScript(
        WEAKEN_SCRIPT,
        serverName,
        targetServer.name,
        1
      );
      if (weakeningScript !== null) {
        targetServer.beingWeakenedBy.push({
          serverName: serverName,
          threadCount: weakeningScript.threads,
        });
      }

      const hackingScript = ns.getRunningScript(
        HACK_SCRIPT,
        serverName,
        targetServer.name,
        1
      );
      if (hackingScript !== null) {
        targetServer.beingHackedBy.push({
          serverName: serverName,
          threadCount: hackingScript.threads,
        });
      }
    }
  }

  const table = formatTable(
    {
      [SERVER_NAME_COLUMN_HEADER]: LEFT_ALIGNMENT,
      [AVAILABLE_MONEY_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [SECURITY_LEVEL_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [HACK_CHANCE_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [BEING_GROWN_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [BEING_WEAKENED_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [BEING_HACKED_COLUMN_HEADER]: RIGHT_ALIGNMENT,
    },
    ...hackableServers.map(server => [server.getTableRow()])
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

    this.hackHeuristic = getHackingHeuristic(ns, serverName);

    this.availableMoney = ns.getServerMoneyAvailable(serverName);
    this.percentMaxMoney =
      this.availableMoney / ns.getServerMaxMoney(serverName);

    this.securityLevel = ns.getServerSecurityLevel(serverName);
    this.minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
    this.hackChance = ns.hackAnalyzeChance(serverName);

    this.growTime = ns.getGrowTime(serverName);
    this.weakenTime = ns.getWeakenTime(serverName);
    this.hackTime = ns.getHackTime(serverName);

    this.beingGrownBy = [];
    this.beingWeakenedBy = [];
    this.beingHackedBy = [];
  }

  _formatScripts(scripts) {
    if (scripts.length === 0) return '--';

    const totalThreadCount = scripts
      .map(script => script.threadCount)
      .reduce((a, b) => a + b);
    const totalServerCount = scripts.length;
    return `${totalServerCount} servers\n${formatNumber(
      totalThreadCount,
      true
    )} threads`;
  }

  getTableRow() {
    return {
      [SERVER_NAME_COLUMN_HEADER]:
        this.name +
        `\nHack heuristic: ${formatNumber(this.hackHeuristic, true)}`,
      [AVAILABLE_MONEY_COLUMN_HEADER]:
        formatMoney(this.availableMoney, true) +
        ` (${formatPercent(
          this.percentMaxMoney
        )} of max)\nGrow time: ${formatTime(this.growTime)}`,
      [SECURITY_LEVEL_COLUMN_HEADER]: `${this.securityLevel.toFixed(
        2
      )} (out of ${this.minSecurityLevel})\nWeaken time: ${formatTime(
        this.weakenTime
      )}`,
      [HACK_CHANCE_COLUMN_HEADER]: `${formatPercent(
        this.hackChance
      )}\nHack time: ${formatTime(this.hackTime)}`,
      [BEING_GROWN_COLUMN_HEADER]: this._formatScripts(this.beingGrownBy),
      [BEING_WEAKENED_COLUMN_HEADER]: this._formatScripts(this.beingWeakenedBy),
      [BEING_HACKED_COLUMN_HEADER]: this._formatScripts(this.beingHackedBy),
    };
  }
}
