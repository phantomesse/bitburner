import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { getNetWorth, getStockValue } from 'utils/money';

/**
 * Get net worth including stocks.
 * @param {NS} ns
 */
export async function main(ns) {
  ns.tprintf(`Total ${formatMoney(ns, getNetWorth(ns))}`);
  ns.tprintf(
    `Cash: ${formatMoney(ns, ns.getServerMoneyAvailable(HOME_HOSTNAME))}`
  );
  ns.tprintf(`Stocks: ${formatMoney(ns, getStockValue(ns))}`);
}
