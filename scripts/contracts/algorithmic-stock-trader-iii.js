/**
 * Algorithmic Stock Trader III
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 118,24,44,45,105,123,12,163,156,2,150,98,47,192,12,113,93,143,105,118,96,16,86,43,18,179,80,81,91,9
 *
 * Determine the maximum possible profit you can earn using at most two
 * transactions. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 *
 * If no profit can be made, then the answer should be 0
 *
 * @param {string} input
 * @returns {number}
 */
export function algorithmicStockTraderIII(input) {
  // Get first diffs.
  const firstTrades = _getTrades(input, 0);

  let highestProfit = 0;
  let trades;
  for (const firstTrade of firstTrades) {
    const secondTrades = _getTrades(input, firstTrade.sell.day + 1);
    for (const secondTrade of secondTrades) {
      if (firstTrade.diff + secondTrade.diff > highestProfit) {
        highestProfit = firstTrade.diff + secondTrade.diff;
        trades = [firstTrade, secondTrade];
      }
    }
  }
  return highestProfit;
}

function _getTrades(stockPrices, startingBuyDay) {
  const trades = [];
  for (let buyDay = startingBuyDay; buyDay < stockPrices.length - 1; buyDay++) {
    const buyPrice = stockPrices[buyDay];
    for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
      const sellPrice = stockPrices[sellDay];
      trades.push({
        buy: { day: buyDay, price: buyPrice },
        sell: { day: sellDay, price: sellPrice },
        diff: sellPrice - buyPrice,
      });
    }
  }
  return trades;
}
