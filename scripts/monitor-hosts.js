import {
  getAllServers,
  formatMoney,
  formatPercent,
  sortByHackingHeuristic,
  formatTime,
  getHackingHeuristic,
} from './utils.js';

/**
 * Displays all the hackable hosts and their stats.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const hackableHostNames = [...getAllServers(ns)].filter(
    host =>
      ns.getServerMoneyAvailable(host) > 0 &&
      ns.hackAnalyzeChance(host) > 0 &&
      ns.getServerRequiredHackingLevel(host) <= ns.getHackingLevel()
  );
  sortByHackingHeuristic(ns, hackableHostNames);
  const hackableHosts = hackableHostNames.map(host => new Host(ns, host));

  const namePrintLength = getPrintLength(hackableHosts, host => host.name);
  const moneyPrintLength = getPrintLength(hackableHosts, host => host.money);

  let rows = [
    [
      'host name'.padEnd(namePrintLength),
      'money available'.padStart(moneyPrintLength),
      'hack chance',
      'hack time',
      'grow time',
      'weaken time',
      'heuristic',
    ].join(' | '),
    [
      ''.padStart(namePrintLength, '-'),
      ''.padStart(moneyPrintLength, '-'),
      ''.padStart('hack chance'.length, '-'),
      ''.padStart('hack time'.length, '-'),
      ''.padStart('grow time'.length, '-'),
      ''.padStart('weaken time'.length, '-'),
      ''.padStart('heuristic'.length, '-'),
    ].join('-+-'),
  ];
  for (const host of hackableHosts) {
    rows.push(
      [
        host.name.padEnd(namePrintLength),
        host.money.padStart(moneyPrintLength),
        formatPercent(host.hackChance).padStart('hack chance'.length),
        formatTime(host.hackTime).padStart('hack time'.length),
        formatTime(host.growTime).padStart('grow time'.length),
        formatTime(host.weakenTime).padStart('weaken time'.length),
        host.hackingHeuristic.padStart('heuristic'.length),
      ].join(' | ')
    );
  }
  ns.tprint('\n' + rows.join('\n'));
}

class Host {
  /**  @param {import('..').NS } ns */
  constructor(ns, name) {
    this.name = name;

    this.availableMoney = ns.getServerMoneyAvailable(name);
    this.percentOfMaxMoney = this.availableMoney / ns.getServerMaxMoney(name);

    this.hackChance = ns.hackAnalyzeChance(name);
    this.hackTime = ns.getHackTime(name);
    this.growTime = ns.getGrowTime(name);
    this.weakenTime = ns.getWeakenTime(name);

    this.hackingHeuristic = getHackingHeuristic(ns, name).toFixed(2);
  }

  get money() {
    return (
      formatMoney(this.availableMoney) +
      ` (${formatPercent(this.percentOfMaxMoney)} of max)`
    );
  }
}

function getPrintLength(hosts, valueFn) {
  return hosts
    .map(valueFn)
    .reduce((prev, curr) => (curr.length > prev.length ? curr : prev)).length;
}
