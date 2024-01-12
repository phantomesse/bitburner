import { HOME_HOSTNAME } from 'utils/constants';
import {
  getRamToReserve,
  getScriptsCountedTowardsRAMToReserve,
} from 'utils/scripts';
import { tprintTable } from 'utils/table';

/**
 * Lists all scripts on the home server along with their memory.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const scripts = ns.ls(HOME_HOSTNAME, '.js');
  scripts.sort((a, b) => ns.getScriptRam(b) - ns.getScriptRam(a));
  const scriptsCountedTowardsRAMToReserve =
    getScriptsCountedTowardsRAMToReserve(ns);

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (const script of scripts) {
    const countedTowardsRAMToReserve =
      scriptsCountedTowardsRAMToReserve.includes(script);
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Script Name', style: {} },
          content: script,
        },
        {
          column: { name: 'RAM', style: { textAlign: 'right' } },
          content: ns.formatRam(ns.getScriptRam(script)),
        },
        {
          column: { name: 'Count towards RAM to reserve', style: {} },
          content: countedTowardsRAMToReserve ? 'true' : 'false',
        },
      ],
      style: {
        color: countedTowardsRAMToReserve
          ? ns.ui.getTheme().success
          : ns.ui.getTheme().error,
      },
    };
    table.rows.push(row);
  }

  tprintTable(ns, table);
}
