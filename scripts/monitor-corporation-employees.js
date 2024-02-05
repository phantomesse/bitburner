import { getCharters } from 'corporation/charter';
import { getDimmedColor } from 'utils/colors';
import { ONE_MINUTE, ONE_SECOND } from 'utils/constants';
import { printTable } from 'utils/table';

/**
 * Monitors the employees in the corporation.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());
  ns.tail();

  while (true) {
    ns.clearLog();
    const charters = getCharters(ns);

    /** @type {import("utils/table").Table} */ const table = { rows: [] };
    for (const charter of charters) {
      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Division', style: { whiteSpace: 'nowrap' } },
            content: charter.division.name,
          },
          {
            column: { name: 'City', style: {} },
            content: charter.office.city,
          },
        ],
      };

      for (const job in charter.office.employeeJobs) {
        const employeeCount = charter.office.employeeJobs[job];
        const employeeProduction = ns.formatNumber(
          charter.office.employeeProductionByJob[job],
          2
        );
        row.cells.push({
          column: {
            name: job,
            style: { textAlign: 'center', whiteSpace: 'nowrap' },
          },
          content:
            employeeCount === 0
              ? '-'
              : `${employeeCount} (${employeeProduction})`,
          style: {
            ...(employeeCount === 0 && {
              color: getDimmedColor(ns.ui.getTheme().primary),
            }),
          },
        });
      }

      row.cells.push({
        column: { name: '# Employees', style: { textAlign: 'center' } },
        content: `${charter.office.numEmployees} / ${charter.office.size}`,
      });

      table.rows.push(row);
    }
    printTable(ns, table);

    // await ns.corporation.nextUpdate();
    await ns.sleep(ONE_SECOND);
  }
}
