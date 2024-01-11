import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME } from 'utils/constants';

/**
 * Sell all stock.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.scriptKill('manage-stocks.js', HOME_HOSTNAME);

  const symbols = getStocks(ns).map(stock => stock.symbol);

  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);

    // Sell longs.
    ns.stock.sellStock(symbol, position[0]);

    // Sell shorts.
    try {
      ns.stock.sellShort(symbol, position[2]);
    } catch (_) {}
  }
}
