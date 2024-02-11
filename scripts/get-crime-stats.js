import { CRIME_TYPES } from 'utils/constants';
import { formatMoney, formatTime } from 'utils/format';
import { tprintTable } from 'utils/table';

/**
 * Prints out crime stats to the terminal.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  /** @type {import("utils/table").Table} */ const table = { rows: [] };
  for (const crimeType of CRIME_TYPES) {
    const stats = ns.singularity.getCrimeStats(crimeType);
    const chance = ns.singularity.getCrimeChance(crimeType);

    /** @type {import("utils/table").Row} */ const row = {
      cells: [
        { column: { name: 'Crime', style: {} }, content: crimeType },
        {
          column: { name: 'Chance', style: { textAlign: 'center' } },
          content: ns.formatPercent(chance),
        },
        {
          column: { name: 'Money', style: { textAlign: 'center' } },
          content: formatMoney(ns, stats.money),
        },
        {
          column: { name: 'Time', style: { textAlign: 'center' } },
          content: formatTime(ns, stats.time),
        },
        {
          column: { name: 'Avg. Profit / s', style: { textAlign: 'center' } },
          content: formatMoney(
            ns,
            (stats.money * chance) / (stats.time / 1000)
          ),
        },
        {
          column: { name: 'Karma', style: { textAlign: 'center' } },
          content: stats.karma,
        },
        {
          column: { name: 'Avg. Karma / s', style: { textAlign: 'center' } },
          content: ns.formatNumber(
            (stats.karma * chance) / (stats.time / 1000)
          ),
        },
      ],
    };
    table.rows.push(row);
  }
  tprintTable(ns, table);
}
