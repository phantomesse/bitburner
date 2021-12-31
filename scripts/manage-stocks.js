import { sort } from '/utils/misc.js';
import { formatMoney, formatPercent } from '/utils/format.js';

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
    sort(symbols, ns.stock.getAskPrice);
    for (const symbol of symbols) buyStock(ns, symbol);

    // Sort stock symbols sorted from highest to lowest bid price and sell stock
    // starting at the most expensive stock.
    sort(symbols, ns.stock.getBidPrice);
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
    sharesToBuy = Math.ceil(forecast * sharesToBuy);
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
  if (ownedShareCount === 0) return; // Nothing to sell.

  const ownedAvgSharePrice = position[1];
  const bidPrice = ns.stock.getBidPrice(symbol);
  if (bidPrice < ownedAvgSharePrice) return; // We won't make a profit.

  // Determine how much to sell.
  let sharesToSell = ownedShareCount;
  if (ns.stock.purchase4SMarketDataTixApi()) {
    const forecast = ns.stock.getForecast(symbol);
    if (forecast > 0.5) return; // Stock will go up.
    sharesToSell = Math.ceil((forecast / 0.5) * sharesToSell);
  }
  if (sharesToSell === 0) return; // Nothing to sell.
  const gain = ns.stock.getSaleGain(symbol, sharesToSell, 'Long');
  const profit =
    (gain - ownedAvgSharePrice * ownedShareCount) /
    (ownedAvgSharePrice * ownedShareCount);
  if (profit < 0) return; // We won't make a profit.

  const sharePrice = ns.stock.sell(symbol, sharesToSell);
  ns.print(
    `sold ${sharesToSell} shares of ${symbol} at ${formatMoney(
      sharePrice
    )} with profit of ${formatPercent(profit)}`
  );
  ns.toast(
    `sold ${sharesToSell} shares of ${symbol} at ${formatMoney(
      sharePrice
    )} with profit of ${formatPercent(profit)}`
  );
}
