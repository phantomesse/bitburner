import {
  getAllServers,
  formatMoney,
  formatPercent,
  sortByHackGrowWeakenTime,
  formatTime,
} from './utils.js';

/**
 * Displays all the hackable hosts and their stats.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const hackableHostNames = [...getAllServers(ns)]
    .filter(
      server => server !== 'home' && !ns.getPurchasedServers().includes(server)
    )
    .filter(
      host =>
        ns.getServerMoneyAvailable(host) > 0 &&
        ns.hackAnalyzeChance(host) > 0 &&
        ns.getServerRequiredHackingLevel(host) <= ns.getHackingLevel()
    );
  sortByHackGrowWeakenTime(ns, hackableHostNames);
  const hackableHosts = hackableHostNames.map(host => new Host(ns, host));

  const namePrintLength = getPrintLength(hackableHosts, host => host.name);
  const moneyPrintLength = getPrintLength(hackableHosts, host => host.money);

  let rows = [
    [
      rightBuffer('host name', namePrintLength),
      leftBuffer('money available', moneyPrintLength),
      'hack chance',
      'hack time',
      'grow time',
      'weaken time',
    ].join(' | '),
    [
      getUnderline(namePrintLength),
      getUnderline(moneyPrintLength),
      getUnderline('hack chance'.length),
      getUnderline('hack time'.length),
      getUnderline('grow time'.length),
      getUnderline('weaken time'.length),
    ].join('-+-'),
  ];
  for (const host of hackableHosts) {
    rows.push(
      [
        rightBuffer(host.name, namePrintLength),
        leftBuffer(host.money, moneyPrintLength),
        leftBuffer(formatPercent(host.hackChance), 'hack chance'.length),
        leftBuffer(formatTime(host.hackTime), 'hack time'.length),
        leftBuffer(formatTime(host.growTime), 'grow time'.length),
        leftBuffer(formatTime(host.weakenTime), 'weaken time'.length),
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

function rightBuffer(str, printLength) {
  let buffer = '';
  for (let i = str.length; i < printLength; i++) buffer += ' ';
  return str + buffer;
}

function leftBuffer(str, printLength) {
  let buffer = '';
  for (let i = str.length; i < printLength; i++) buffer += ' ';
  return buffer + str;
}

function getUnderline(printLength) {
  let line = '';
  for (let i = 0; i < printLength; i++) line += '-';
  return line;
}
