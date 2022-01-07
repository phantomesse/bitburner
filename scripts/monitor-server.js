import {
  formatPercent,
  formatMoney,
  formatNumber,
  formatTime,
} from '/utils/format.js';

const DISABLE_LOGGING_FUNCTIONS = [
  'sleep',
  'getServerMoneyAvailable',
  'getServerMaxMoney',
  'getServerSecurityLevel',
  'getServerMinSecurityLevel',
];

/**
 * Monitors a single server in logs.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  const serverName = ns.args[0];
  if (typeof serverName !== 'string') {
    ns.tprint('usage: run monitor-server.js <server name>');
    return;
  }

  while (true) {
    ns.clearLog();
    ns.print(serverName);

    const availableMoney = ns.getServerMoneyAvailable(serverName);
    const percentMaxMoney = availableMoney / ns.getServerMaxMoney(serverName);
    ns.print(
      `\navailable money: ${formatMoney(availableMoney)} (${formatPercent(
        percentMaxMoney
      )} of max)`
    );

    const securityLevel = ns.getServerSecurityLevel(serverName);
    const minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
    ns.print(
      `security level:  ${formatNumber(securityLevel)} (min is ${formatNumber(
        minSecurityLevel
      )})`
    );

    ns.print(`hack chance: ${formatPercent(ns.hackAnalyzeChance(serverName))}`);

    ns.print(
      '\n' +
        [
          `time to hack:   ${formatTime(ns.getHackTime(serverName))}`,
          `time to grow:   ${formatTime(ns.getGrowTime(serverName))}`,
          `time to weaken: ${formatTime(ns.getWeakenTime(serverName))}`,
        ].join('\n')
    );

    await ns.sleep(1000);
  }
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autocomplete = data => [...data.servers];
