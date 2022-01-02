/**
 * Algorithmic Stock Trader II
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i.
 *
 * Determine the maximum possible profit you can earn using as many transactions
 * as you'd like. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 *
 * If no profit can be made, then the answer should be 0
 *
 * @param {string} input
 * @returns {number}
 */
export function algorithmicStockTraderII(input) {
  let maxProfit = 0;
  for (let buyDay = 0; buyDay < input.length; buyDay++) {
    const possibleTradeTimelines = _getAllPossibleTradeTimelines(input, buyDay);
    for (const timeline of possibleTradeTimelines) {
      const profit = timeline.map(trade => trade.diff).reduce((a, b) => a + b);
      if (profit > maxProfit) maxProfit = profit;
    }
  }
  return maxProfit;
}

/**
 * @param {int[]} stockPrices
 * @param {int} buyDay
 * @returns {Trade[][]}
 */
function _getAllPossibleTradeTimelines(stockPrices, buyDay) {
  const trades = _getAllPossibleTradesForBuyDay(stockPrices, buyDay);
  if (trades.length === 0) return [];
  const timelines = [];
  for (const trade of trades) {
    for (
      let newBuyDay = trade.sellDay;
      newBuyDay < stockPrices.length - 1;
      newBuyDay++
    ) {
      const followingTimelines = _getAllPossibleTradeTimelines(
        stockPrices,
        newBuyDay
      );
      for (const followingTimeline of followingTimelines) {
        timelines.push([trade, ...followingTimeline]);
      }
    }
    timelines.push([trade]);
  }
  return timelines;
}

/**
 * @param {int[]} stockPrices
 * @param {int} startBuyDay
 * @returns {Trade[]}
 */
function _getAllPossibleTradesForBuyDay(stockPrices, buyDay) {
  const trades = [];
  for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
    trades.push(_getTrade(stockPrices, buyDay, sellDay));
  }
  return trades;
}

/**
 * @typedef {Object} Trade
 * @property {int} buyDay
 * @property {int} buyPrice
 * @property {int} sellDay
 * @property {int} sellPrice
 * @property {int} diff
 */

/**
 * Get information about a trade.
 * @param {int[]} stockPrices where value is the price and the index is the day
 * @param {int} buyDay
 * @param {int} sellDay
 * @returns {Trade}
 */
function _getTrade(stockPrices, buyDay, sellDay) {
  const buyPrice = stockPrices[buyDay];
  const sellPrice = stockPrices[sellDay];
  return {
    buyDay: buyDay,
    buyPrice: buyPrice,
    sellDay: sellDay,
    sellPrice: sellPrice,
    diff: sellPrice - buyPrice,
  };
}
