import { CRIME_TYPES } from 'utils/constants';
import { formatMoney, formatTime } from 'utils/format';
import { tprintTable } from 'utils/table';

/**
 * @typedef Crime
 * @property {import("../NetscriptDefinitions").CrimeType} type
 * @property {import("../NetscriptDefinitions").CrimeStats} stats
 * @property {number} chance
 * @property {number} averageProfitPerSecond
 *
 * Prints out crime stats to the terminal.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  /** @type {Crime[]} */
  const crimes = CRIME_TYPES.map(type => {
    const stats = ns.singularity.getCrimeStats(type);
    const chance = ns.singularity.getCrimeChance(type);
    const averageProfitPerSecond = (stats.money * chance) / (stats.time / 1000);
    return {
      type,
      stats,
      chance,
      averageProfitPerSecond,
    };
  }).sort(
    (crime1, crime2) =>
      crime2.averageProfitPerSecond - crime1.averageProfitPerSecond
  );

  /** @type {import("utils/table").Table} */ const table = { rows: [] };
  for (const crime of crimes) {
    /** @type {import("utils/table").Row} */ const row = {
      cells: [
        { column: { name: 'Crime', style: {} }, content: crime.type },
        {
          column: { name: 'Chance', style: { textAlign: 'center' } },
          content: ns.formatPercent(crime.chance),
        },
        {
          column: { name: 'Money', style: { textAlign: 'center' } },
          content: formatMoney(ns, crime.stats.money),
        },
        {
          column: { name: 'Time', style: { textAlign: 'center' } },
          content: formatTime(ns, crime.stats.time),
        },
        {
          column: { name: 'Avg. Profit / s', style: { textAlign: 'center' } },
          content: formatMoney(ns, crime.averageProfitPerSecond),
        },
        {
          column: { name: 'Karma', style: { textAlign: 'center' } },
          content: crime.stats.karma,
        },
        {
          column: { name: 'Avg. Karma / s', style: { textAlign: 'center' } },
          content: ns.formatNumber(
            (crime.stats.karma * crime.chance) / (crime.stats.time / 1000)
          ),
        },
        {
          column: { name: 'Str Exp', style: { textAlign: 'center' } },
          content: getAverageStatIncrease(
            ns,
            crime.stats.strength_exp,
            crime.stats.strength_success_weight,
            crime.chance,
            crime.stats.time
          ),
        },
        {
          column: { name: 'Def Exp', style: { textAlign: 'center' } },
          content: getAverageStatIncrease(
            ns,
            crime.stats.defense_exp,
            crime.stats.defense_success_weight,
            crime.chance,
            crime.stats.time
          ),
        },
        {
          column: { name: 'Dex Exp', style: { textAlign: 'center' } },
          content: getAverageStatIncrease(
            ns,
            crime.stats.dexterity_exp,
            crime.stats.dexterity_success_weight,
            crime.chance,
            crime.stats.time
          ),
        },
        {
          column: { name: 'Agi Exp', style: { textAlign: 'center' } },
          content: getAverageStatIncrease(
            ns,
            crime.stats.agility_exp,
            crime.stats.agility_success_weight,
            crime.chance,
            crime.stats.time
          ),
        },
      ],
    };
    table.rows.push(row);
  }
  tprintTable(ns, table);
}

/**
 * @param {NS} ns
 * @param {number} exp
 * @param {number} successWeight
 * @param {number} chance chance of successfully completing the crime
 * @param {number} time that it takse to complete crime in seconds
 * @returns {string} average stat increase per second
 */
function getAverageStatIncrease(ns, exp, successWeight, chance, time) {
  const averageStatIncrease =
    (exp * successWeight * chance + exp * (1 - chance)) / (time / 1000);
  return averageStatIncrease === 0 ? '-' : ns.formatNumber(averageStatIncrease);
}
