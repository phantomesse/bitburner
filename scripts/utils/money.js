import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME } from 'utils/constants';

/**
 * Gets net worth including stocks.
 *
 * @param {NS} ns
 * @returns {number} net worth
 */
export function getNetWorth(ns) {
  const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);
  return moneyAvailable + getStockValue(ns);
}

/**
 * Gets amount of money in stocks subtracking commission.
 *
 * @param {NS} ns
 * @returns {number} money value in stocks
 */
export function getStockValue(ns) {
  const commission = ns.stock.getConstants().StockMarketCommission;
  return getStocks(ns)
    .map(
      stock =>
        ns.stock.getAskPrice(stock.symbol) *
          ns.stock.getPosition(stock.symbol)[0] -
        commission
    )
    .reduce((a, b) => a + b);
}
