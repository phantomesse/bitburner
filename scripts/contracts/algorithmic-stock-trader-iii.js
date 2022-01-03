/**
 * Algorithmic Stock Trader III
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i.
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
  for (const firstTrade of firstTrades) {
    const secondTrades = _getTrades(input, firstTrade.sell.day + 1);
    for (const secondTrade of secondTrades) {
      if (firstTrade.diff + secondTrade.diff > highestProfit) {
        highestProfit = firstTrade.diff + secondTrade.diff;
        console.log(firstTrade);
        console.log(secondTrade);
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

const input = [
  16, 171, 74, 18, 34, 182, 173, 19, 128, 36, 43, 124, 27, 163, 69, 154, 34, 92,
  72, 152, 142, 90, 200,
];

console.log(algorithmicStockTraderIII(input));
