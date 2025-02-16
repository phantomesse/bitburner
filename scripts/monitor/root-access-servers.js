import {
  createColorForString,
  getGrowColor,
  getHackColor,
  getWeakenColor,
} from 'utils/color';
import { formatTime } from 'utils/format';
import { GROW_JS, HACK_JS, WEAKEN_JS } from 'utils/script';
import { getAllServerNames } from 'utils/server';
import { Cell, LEFT_ALIGN_STYLES, printTable, Table } from 'utils/table';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  while (true) {
    ns.clearLog();

    const serverNames = getAllServerNames(ns).filter(ns.hasRootAccess);

    const table = new Table('Available RAM');
    for (const serverName of serverNames) {
      const maxRam = ns.getServerMaxRam(serverName);
      if (maxRam === 0) continue;

      table.cells.push({
        columnName: 'Server Name',
        columnStyles: LEFT_ALIGN_STYLES,
        rowId: serverName,
        content: serverName,
        value: serverName,
        cellStyles: {
          'align-items': 'flex-start',
          color: createColorForString(ns, serverName),
        },
      });

      // RAM.
      table.cells.push(getAvailableRamCell(ns, serverName));

      // Running scripts.
      table.cells.push(
        getRunningScriptsCell(ns, serverName, HACK_JS, 'Hack', {
          color: getHackColor(ns),
        })
      );
      table.cells.push(
        getRunningScriptsCell(ns, serverName, GROW_JS, 'Grow', {
          color: getGrowColor(ns),
        })
      );
      table.cells.push(
        getRunningScriptsCell(ns, serverName, WEAKEN_JS, 'Weaken', {
          color: getWeakenColor(ns),
        })
      );
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
function getAvailableRamCell(ns, serverName) {
  const maxRam = ns.getServerMaxRam(serverName);
  const usedRam = ns.getServerUsedRam(serverName);
  const availableRam = maxRam - usedRam;

  /** @type {Cell} */ const cell = {
    columnName: 'Available RAM',
    rowId: serverName,
    value: 1 / maxRam,
    cellStyles: {
      position: 'relative',
      'align-items': 'flex-start',
      'min-width': 'max-content',
    },
  };

  const availableRamElement = React.createElement('div', {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: ns.formatPercent(usedRam / maxRam),
      height: '100%',
      background: ns.ui.getTheme().warningdark,
      opacity: 0.1,
      'z-index': -1,
    },
  });

  cell.content = React.createElement(
    'div',
    {},
    availableRamElement,
    `${ns.formatNumber(availableRam, 2)} / ${ns.formatRam(maxRam, 0)}`
  );

  return cell;
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @param {string} scriptName
 * @param {string} columnName
 * @param {string} columnStyles
 * @returns {Cell}
 */
function getRunningScriptsCell(
  ns,
  serverName,
  scriptName,
  columnName,
  columnStyles
) {
  /** @type {Cell} */ const cell = {
    columnName,
    columnStyles: {
      ...LEFT_ALIGN_STYLES,
      ...columnStyles,
      'align-items': 'flex-start',
      width: '380px',
    },
    rowId: serverName,
  };

  const processes = ns
    .ps(serverName)
    .filter((process) => process.filename === scriptName);
  const scriptElements = [];
  for (const process of processes) {
    const targetServerName = process.args[0];
    const threadCount = process.threads;

    const processInfo = ns.getRunningScript(process.pid);
    const totalRunningTime =
      processInfo.offlineRunningTime + processInfo.onlineRunningTime;

    const serverNameElement = React.createElement(
      'span',
      {
        style: {
          color: createColorForString(ns, targetServerName),
        },
      },
      targetServerName
    );

    const scriptMetadataElement = React.createElement(
      'span',
      {
        style: {
          'font-size': 'smaller',
        },
      },
      ` (${threadCount} threads, started ${formatTime(
        totalRunningTime * 1000
      )} ago)`
    );

    scriptElements.push(
      React.createElement('div', {}, serverNameElement, scriptMetadataElement)
    );
  }

  if (scriptElements.length === 0) return cell;
  cell.content = React.createElement('div', {}, ...scriptElements);
  return cell;
}
