import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';
import { formatMoney } from 'utils/format';

/**
 * Monitors net worth.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.moveTail(1000, 200);

  while (true) {
    ns.clearLog();
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
    ns.sleep(ONE_SECOND);
  }
}
