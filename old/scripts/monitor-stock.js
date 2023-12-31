import { getForecast } from '/utils/stock.js';
import { formatMoney, formatNumber, formatPercent } from '/utils/format.js';

/**
 * Monitors a single stock in logs.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  let symbols = [];
  try {
    symbols = ns.stock.getSymbols();
  } catch (_) {
    ns.tprint('stock API not bought yet');
    return;
  }

  const symbol = ns.args[0];
  if (typeof symbol !== 'string' || !symbols.includes(symbol)) {
    ns.tprint('usage: run monitor-stock.js <stock symbol> --tail');
    return;
  }

  while (true) {
    ns.clearLog();
    ns.print(symbol);

    const position = ns.stock.getPosition(symbol);
    const ownedShareCount = position[0];
    const ownedAvgSharePrice = position[1];
    ns.print('owned shared count:     ', formatNumber(ownedShareCount));
    ns.print('owned avg. share price: ', formatMoney(ownedAvgSharePrice));

    const askPrice = ns.stock.getAskPrice(symbol);
    const bidPrice = ns.stock.getBidPrice(symbol);
    ns.print('ask price: ', formatMoney(askPrice));
    ns.print('bid price: ', formatMoney(bidPrice), '\n');
    ns.print('forecast: ', formatPercent(getForecast(ns, symbol)));

    await ns.sleep(6000);
  }
}
