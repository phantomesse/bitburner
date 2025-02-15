import {
  createColorForString,
  getGrowColor,
  getHackColor,
  getWeakenColor,
} from 'utils/color';
import { formatTime } from 'utils/format';
import {
  getAllServerNames,
  getGrowScore,
  getHackScore,
  getWeakenScore,
  isHackable,
} from 'utils/server';
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

    const table = new Table('Hack Score');
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
        cellStyles: {
          color: createColorForString(ns, serverName),
        },
      });

      // Money
      table.cells.push(getMoneyAvailableCell(ns, serverName));
      table.cells.push(getMaxMoneyCell(ns, serverName));

      // Security Level
      const currentSecurityLevel = ns.getServerSecurityLevel(serverName);
      const minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
      table.cells.push({
        columnName: '🔐 Level',
        rowId: serverName,
        content: `${ns.formatNumber(
          currentSecurityLevel,
          2
        )} (+${ns.formatNumber(currentSecurityLevel - minSecurityLevel, 2)})`,
        value: currentSecurityLevel,
        columnStyles: { color: getWeakenColor(ns) },
      });

      table.cells.push({
        columnName: 'Min 🔐',
        rowId: serverName,
        content: ns.formatNumber(minSecurityLevel, 0),
        value: minSecurityLevel,
        columnStyles: { color: getWeakenColor(ns) },
      });

      // Hack
      const hackScore = getHackScore(ns, serverName);
      table.cells.push({
        columnName: 'Hack Score',
        rowId: serverName,
        content: ns.formatNumber(hackScore, 2),
        value: hackScore,
        columnStyles: { color: getHackColor(ns) },
      });

      const hackChance = ns.hackAnalyzeChance(serverName);
      table.cells.push({
        columnName: 'Hack 🎲',
        rowId: serverName,
        content: ns.formatPercent(hackChance, 0),
        value: hackChance,
        columnStyles: { color: getHackColor(ns) },
      });

      const hackTime = ns.getHackTime(serverName);
      table.cells.push({
        columnName: 'Hack ⏱️',
        rowId: serverName,
        content: formatTime(hackTime),
        value: hackTime,
        columnStyles: { color: getHackColor(ns) },
      });

      // Grow
      const growScore = getGrowScore(ns, serverName);
      table.cells.push({
        columnName: 'Grow Score',
        rowId: serverName,
        content: ns.formatNumber(growScore, 2),
        value: growScore,
        columnStyles: { color: getGrowColor(ns) },
      });

      const growTime = ns.getGrowTime(serverName);
      table.cells.push({
        columnName: 'Grow ⏱️',
        rowId: serverName,
        content: formatTime(growTime),
        value: growTime,
        columnStyles: {
          color: getGrowColor(ns),
        },
      });

      // Weaken
      const weakenScore = getWeakenScore(ns, serverName);
      table.cells.push({
        columnName: 'Weaken Score',
        rowId: serverName,
        content: ns.formatNumber(weakenScore, 2),
        value: weakenScore,
        columnStyles: { color: getWeakenColor(ns) },
      });

      const weakenTime = ns.getWeakenTime(serverName);
      table.cells.push({
        columnName: 'Weaken️ ⏱️',
        rowId: serverName,
        content: formatTime(weakenTime),
        value: weakenTime,
        columnStyles: { color: getWeakenColor(ns) },
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
    columnStyles: { color: getGrowColor(ns) },
  };
  const moneyAvailable = ns.getServerMoneyAvailable(serverName);

  if (Math.round(moneyAvailable) === 0) return cell;

  const maxMoney = ns.getServerMaxMoney(serverName);
  cell.content = `$${ns.formatNumber(moneyAvailable, 2)} (${ns.formatPercent(
    moneyAvailable / maxMoney,
    0
  )})`;
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
    columnStyles: { color: getGrowColor(ns) },
  };
  const maxMoney = ns.getServerMaxMoney(serverName);

  if (maxMoney === 0) return cell;

  cell.content = '$' + ns.formatNumber(maxMoney, 2);
  cell.value = maxMoney;
  return cell;
}
