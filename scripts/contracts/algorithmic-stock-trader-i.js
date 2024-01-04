import { Transaction } from 'contracts/algorithmic-stock-trader';

/**
 * Algorithmic Stock Trader I
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 35,172,130,31,111,79,19,41,125,183,11,39,153,11,19,126,130,22,139,134,54,47,169,138,75
 *
 * Determine the maximum possible profit you can earn using at most one
 * transaction (i.e. you can only buy and sell the stock once). If no profit can
 * be made then the answer should be 0. Note that you have to buy the stock
 * before you can sell it
 *
 * @param {number[]} stockPrices
 * @returns {number} profit
 */
export default function algorithmicStockTraderI(stockPrices) {
  const transactions = [];

  for (let buyDay = 0; buyDay < stockPrices.length; buyDay++) {
    for (let sellDay = buyDay; sellDay < stockPrices.length; sellDay++) {
      const transaction = new Transaction(stockPrices, buyDay, sellDay);
      if (transaction.profit >= 0) transactions.push(transaction);
    }
  }

  return Math.max(...transactions.map(transaction => transaction.profit));
}
