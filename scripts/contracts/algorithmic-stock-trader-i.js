/**
 * Algorithmic Stock Trader I
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 112,61,181,149,39,17,143,192,196,120,151
 *
 * Determine the maximum possible profit you can earn using at most one
 * transaction (i.e. you can only buy and sell the stock once). If no profit can
 * be made then the answer should be 0. Note that you have to buy the stock
 * before you can sell it
 *
 * @param {string} input
 * @returns {number}
 */
export function algorithmicStockTraderI(input) {
  let maxProfit = 0;
  for (let day = 0; day < input.length - 1; day++) {
    const profit = Math.max(...input.slice(day + 1)) - input[day];
    if (profit > maxProfit) maxProfit = profit;
  }
  return maxProfit;
}
