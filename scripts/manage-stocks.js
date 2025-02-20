import { getMoneyAvailableToSpend } from 'utils/money';
import { getAllStockSymbols } from 'utils/stocks';

const MIN_FORECAST_TO_BUY = 0.6;
const MAX_FORECAST_TO_SELL = 0.4;

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.stock.hasTIXAPIAccess() || !ns.stock.has4SDataTIXAPI()) {
    return;
  }

  const symbols = getAllStockSymbols(ns);

  while (true) {
    const symbolToForecastMap = {};
    for (const symbol of symbols) {
      symbolToForecastMap[symbol] = ns.stock.getForecast(symbol);
    }

    // Buy stock.
    const symbolsToBuy = symbols
      .filter((symbol) => symbolToForecastMap[symbol] > MIN_FORECAST_TO_BUY)
      .sort(
        (symbol1, symbol2) =>
          symbolToForecastMap[symbol2] - symbolToForecastMap[symbol1]
      );
    for (const symbol of symbolsToBuy) {
      buy(ns, symbol);
    }

    // Sell stock.
    const symbolsToSell = symbols
      .filter((symbol) => symbolToForecastMap[symbol] < MAX_FORECAST_TO_SELL)
      .sort(
        (symbol1, symbol2) =>
          symbolToForecastMap[symbol1] - symbolToForecastMap[symbol2]
      );
    for (const symbol of symbolsToSell) {
      sell(ns, symbol);
    }

    await ns.sleep(ns.stock.getConstants().msPerStockUpdate);
  }
}

/**
 * Buy as much of a stock as possible.
 *
 * @param {NS} ns
 * @param {string} symbol
 */
function buy(ns, symbol) {
  const maxSharesToBuy =
    ns.stock.getMaxShares(symbol) - ns.stock.getPosition(symbol)[0];
  if (maxSharesToBuy === 0) return;

  for (
    let sharesToBuy = maxSharesToBuy;
    sharesToBuy > 0;
    sharesToBuy = Math.floor(sharesToBuy / 2)
  ) {
    const purchaseCost = ns.stock.getPurchaseCost(symbol, sharesToBuy, 'Long');
    if (purchaseCost >= getMoneyAvailableToSpend(ns)) continue;

    ns.stock.buyStock(symbol, sharesToBuy);
    return;
  }
}

/**
 * Sell as little of a given stock such that it is still profitable.
 *
 * @param {NS} ns
 * @param {string} symbol
 */
function sell(ns, symbol) {
  const sharesOwned = ns.stock.getPosition(symbol)[0];
  if (sharesOwned === 0) return;

  for (let sharesToSell = 1; sharesToSell <= sharesOwned; sharesToSell++) {
    const saleGain = ns.stock.getSaleGain(symbol, sharesToSell, 'Long');
    if (saleGain <= 0) continue;

    ns.stock.sellStock(symbol, sharesToSell);
    return;
  }
}
