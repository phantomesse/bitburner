import { formatTime } from 'utils/format';
import { getAllServerNames, isHackable } from 'utils/server';
import { Cell, printTable, Table } from 'utils/table';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  while (true) {
    ns.clearLog();

    const hackableServerNames = getAllServerNames(ns).filter((serverName) =>
      isHackable(ns, serverName)
    );

    const table = new Table('Hack ⏱️');
    for (const serverName of hackableServerNames) {
      table.cells.push({
        columnName: 'Server Name',
        columnStyles: {
          'justify-content': 'flex-start',
          'text-align': 'left',
        },
        rowId: serverName,
        content: serverName,
        value: serverName,
      });

      // Money
      table.cells.push(getMoneyAvailableCell(ns, serverName));
      table.cells.push(getMaxMoneyCell(ns, serverName));

      // Security Level
      const currentSecurityLevel = ns.getServerSecurityLevel(serverName);
      table.cells.push({
        columnName: '🔐 Level',
        rowId: serverName,
        content: ns.formatNumber(currentSecurityLevel, 2),
        value: currentSecurityLevel,
      });

      const minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
      table.cells.push({
        columnName: 'Min 🔐',
        rowId: serverName,
        content: ns.formatNumber(minSecurityLevel, 2),
        value: minSecurityLevel,
      });

      // Hack
      const hackChance = ns.hackAnalyzeChance(serverName);
      table.cells.push({
        columnName: 'Hack 🎲',
        rowId: serverName,
        content: ns.formatNumber(hackChance),
        value: hackChance,
      });

      const hackTime = ns.getHackTime(serverName);
      table.cells.push({
        columnName: 'Hack ⏱️',
        rowId: serverName,
        content: formatTime(hackTime),
        value: hackTime,
      });

      // Grow
      const growTime = ns.getGrowTime(serverName);
      table.cells.push({
        columnName: 'Grow ⏱️',
        rowId: serverName,
        content: formatTime(growTime),
        value: growTime,
      });

      // Weaken
      const weakenTime = ns.getWeakenTime(serverName);
      table.cells.push({
        columnName: 'Weaken️ ⏱️',
        rowId: serverName,
        content: formatTime(weakenTime),
        value: weakenTime,
      });
    }

    printTable(ns, table);

    await ns.sleep(1000);
  }
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {Cell}
 */
function getMoneyAvailableCell(ns, serverName) {
  const cell = {
    columnName: '💸 Available',
    rowId: serverName,
  };
  const moneyAvailable = ns.getServerMoneyAvailable(serverName);

  if (Math.round(moneyAvailable) === 0) return cell;

  const maxMoney = ns.getServerMaxMoney(serverName);
  cell.content = `$${ns.formatNumber(moneyAvailable, 2)} (${ns.formatNumber(
    (moneyAvailable / maxMoney) * 100,
    0
  )}%)`;
  cell.value = moneyAvailable;
  return cell;
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {Cell}
 */
function getMaxMoneyCell(ns, serverName) {
  const cell = {
    columnName: 'Max 💸',
    rowId: serverName,
  };
  const maxMoney = ns.getServerMaxMoney(serverName);

  if (maxMoney === 0) return cell;

  cell.content = '$' + ns.formatNumber(maxMoney, 2);
  cell.value = maxMoney;
  return cell;
}
