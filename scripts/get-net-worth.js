import { formatMoney } from '/utils/format.js';
import { getNetWorth } from '/utils/misc.js';

/**
 * Prints out net worth.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const netWorth = getNetWorth(ns);
  ns.tprint(`${formatMoney(netWorth)} (${formatMoney(netWorth, true)})`);
}
