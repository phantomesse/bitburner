const COMMISSION_FEE = 100000;
const MIN_PRICE_HISTORY_MILLIS = 5 * 6 * 1000; // Min 5 ticks of history.
const MAX_PRICE_HISTORY_MILLIS = 10 * 60 * 1000; // Max 10 minutes of history.

/**
 * Map of timestamp to price.
 *
 * @typedef {Object.<string, number>} PriceHistory
 */

/** @type {Object.<string, PriceHistory>} */
const symbolToAskPriceHistoryMap = {};

/** @type {Object.<string, number>} */
const symbolToMaxAskPriceMap = {};

/** @type {Object.<string, number>} */
const symbolToMinAskPriceMap = {};

/**
 * Gets how much a stock is worth based on how much of it we own and how much
 * the bid price is.
 *
 * @param {import ('../index').NS} ns
 * @param {string} symbol
 */
export function getStockWorth(ns, symbol) {
  const ownedShares = ns.stock.getPosition(symbol)[0];
  const bidPrice = ns.stock.getBidPrice(symbol);
  return ownedShares * bidPrice - COMMISSION_FEE;
}

/**
 * Gets the real forecast or get a predicted forecast for a given stock symbol.
 *
 * @param {import ('../index').NS} ns
 * @param {string} symbol
 * @returns {number}
 */
export function getForecast(ns, symbol) {
  try {
    return ns.stock.getForecast(symbol);
  } catch (_) {
    return predictForecast(ns, symbol);
  }
}

/**
 * Predicts the forecast based on how many times the ask price has increased or
 * decreased in the past.
 *
 * @param {import ('../index').NS} ns
 * @param {string} symbol
 * @returns {number}
 */
function predictForecast(ns, symbol) {
  const currentTimestamp = Date.now();
  const currentAskPrice = ns.stock.getAskPrice(symbol);
  if (!(symbol in symbolToAskPriceHistoryMap)) {
    symbolToAskPriceHistoryMap[symbol] = {
      [currentTimestamp]: currentAskPrice,
    };
    return 0.5;
  }
  symbolToAskPriceHistoryMap[symbol][currentTimestamp] = currentAskPrice;
  const askPrices = Object.values(symbolToAskPriceHistoryMap[symbol]);
  symbolToMaxAskPriceMap[symbol] = Math.max(...askPrices);
  symbolToMinAskPriceMap[symbol] = Math.min(...askPrices);

  // Not enough data.
  let timestamps = getAskPriceHistoryTimestamps(symbol);
  const historyMillis = currentTimestamp - Math.min(...timestamps);
  if (historyMillis < MIN_PRICE_HISTORY_MILLIS) return 0.5;

  if (historyMillis > MAX_PRICE_HISTORY_MILLIS) {
    // Trim out any data points that we no longer need.
    for (const timestamp of timestamps) {
      if (currentTimestamp - timestamp > MAX_PRICE_HISTORY_MILLIS) {
        delete symbolToAskPriceHistoryMap[symbol][timestamp];
      }
    }
  }

  timestamps = getAskPriceHistoryTimestamps(symbol);
  const askPriceHistory = symbolToAskPriceHistoryMap[symbol];
  let noChangeCount = 0;
  let increaseCount = 0;
  let decreaseCount = 0;
  for (let i = 1; i < timestamps.length; i++) {
    const askPriceDiff =
      askPriceHistory[timestamps[i]] - askPriceHistory[timestamps[i - 1]];
    if (askPriceDiff > 0) increaseCount++;
    else if (askPriceDiff < 0) decreaseCount++;
    else if (timestamps[i] - timestamps[i - 1] >= 6000) noChangeCount++;
  }

  const totalCount = noChangeCount + increaseCount + decreaseCount;
  let forecast = 0.5 + increaseCount / totalCount - decreaseCount / totalCount;
  for (let i = 0; i < noChangeCount; i++) {
    if (forecast < 0.5) forecast += noChangeCount / totalCount;
    if (forecast > 0.5) forecast -= noChangeCount / totalCount;
  }
  if (symbolToMaxAskPriceMap[symbol] === currentAskPrice) forecast /= 2;
  if (symbolToMinAskPriceMap[symbol] === currentAskPrice) forecast *= 2;
  return forecast;
}

/**
 * @param {string} symbol
 * @returns {number[]}
 */
function getAskPriceHistoryTimestamps(symbol) {
  const timestamps = Object.keys(symbolToAskPriceHistoryMap[symbol]).map(
    timestamp => parseInt(timestamp)
  );
  timestamps.sort();
  return timestamps;
}
