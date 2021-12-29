import { formatMoney } from './utils.js';

const COMMISSION_FEE = 100000;

const DISABLE_LOGGING_FUNCTIONS = [
  'sleep',
  'stock.buy',
  'stock.sell',
  'stock.purchase4SMarketDataTixApi',
];

/**
 * Manages buying and selling stocks.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  const symbols = ns.stock.getSymbols();

  while (true) {
    // Sort stock symbols sorted from lowest to highest ask price and buy stock
    // starting with the cheapest stock.
    symbols.sort(
      (symbol1, symbol2) =>
        ns.stock.getAskPrice(symbol1) - ns.stock.getAskPrice(symbol2)
    );
    for (const symbol of symbols) buyStock(ns, symbol);

    // Sort stock symbols sorted from highest to lowest bid price and sell stock
    // starting at the most expensive stock.
    symbols.sort(
      (symbol1, symbol2) =>
        ns.stock.getBidPrice(symbol2) - ns.stock.getBidPrice(symbol1)
    );
    for (const symbol of symbols) sellStock(ns, symbol);

    await ns.sleep(6000); // Sleep for 6 seconds.
  }
}

/**
 * @param {import('..').NS } ns
 * @param {string} symbol
 */
function buyStock(ns, symbol) {
  const ownedShareCount = ns.stock.getPosition(symbol)[0];
  let sharesToBuy = Math.min(
    Math.floor(
      (ns.getPlayer().money - COMMISSION_FEE) / ns.stock.getAskPrice(symbol)
    ),
    ns.stock.getMaxShares(symbol) - ownedShareCount
  );
  if (sharesToBuy <= 0) return;

  if (ns.stock.purchase4SMarketDataTixApi()) {
    const forecast = ns.stock.getForecast(symbol);
    if (forecast < 0.5) return;
    sharesToBuy = forecast * sharesToBuy;
  }

  const sharePrice = ns.stock.buy(symbol, sharesToBuy);
  ns.print(
    `bought ${sharesToBuy} shares of ${symbol} at ${formatMoney(sharePrice)}`
  );
}

/**
 * @param {import('..').NS } ns
 * @param {string} symbol
 */
function sellStock(ns, symbol) {
  const position = ns.stock.getPosition(symbol);
  const ownedShareCount = position[0];
  if (ownedShareCount === 0) return;

  const ownedAvgShareCost = position[1];
  const gain = ns.stock.getSaleGain(symbol, ownedShareCount, 'Long');
  const profit = gain / (ownedAvgShareCost * ownedShareCount);

  // If profit is less than 1, then we won't be profitting.
  if (profit < 1) return;

  let sharesToSell = ownedShareCount;
  if (ns.stock.purchase4SMarketDataTixApi()) {
    const forecast = ns.stock.getForecast(symbol);
    if (forecast > 0.5) return;
    sharesToSell = (0.5 - forecast) * sharesToSell;
  }

  const sharePrice = ns.stock.sell(symbol, sharesToSell);
  ns.print(
    `sold ${sharesToSell} shares of ${symbol} at ${formatMoney(sharePrice)}`
  );
}
