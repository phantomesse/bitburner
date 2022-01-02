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
 * @param {string} stockPrices
 * @returns {number}
 */
export function algorithmicStockTraderII(stockPrices) {
  let profit = 0;

  let day = -1;
  while (day < stockPrices.length) {
    day++;
    if (stockPrices[day + 1] > stockPrices[day]) {
      let minPrice = stockPrices[day];
      day++;

      while (
        day < stockPrices.length &&
        stockPrices[day + 1] > stockPrices[day]
      ) {
        day++;
      }
      let maxPrice = stockPrices[day];
      profit += maxPrice - minPrice;
    }
  }

  return profit;
}
