import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME } from 'utils/constants';
import { formatMoney } from 'utils/format';

/**
 * Get net worth including stocks.
 * @param {NS} ns
 */
export async function main(ns) {
  const commission = ns.stock.getConstants().StockMarketCommission;
  const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);
  const moneyInStocks = getStocks(ns)
    .map(
      stock =>
        ns.stock.getAskPrice(stock.symbol) *
          ns.stock.getPosition(stock.symbol)[0] -
        commission
    )
    .reduce((a, b) => a + b);
  ns.tprintf(`Total ${formatMoney(ns, moneyAvailable + moneyInStocks)}`);
  ns.tprintf(`Cash: ${formatMoney(ns, moneyAvailable)}`);
  ns.tprintf(`Stocks: ${formatMoney(ns, moneyInStocks)}`);
}
