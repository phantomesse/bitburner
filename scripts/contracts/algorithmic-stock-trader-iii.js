import { Permutation, Transaction } from 'contracts/algorithmic-stock-trader';

/**
 * Algorithmic Stock Trader III
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 47,69,73,32,15,167,100,135,5,80,18,192,171,183,152
 *
 * Determine the maximum possible profit you can earn using at most two
 * transactions. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 *
 * If no profit can be made, then the answer should be 0
 *
 * @param {number[]} stockPrices
 * @returns {number} profit
 */
export default function algorithmicStockTraderIII(stockPrices) {
  const permutations = [];

  for (let buyDay1 = 0; buyDay1 < stockPrices.length; buyDay1++) {
    for (let sellDay1 = buyDay1; sellDay1 < stockPrices.length; sellDay1++) {
      const transaction1 = new Transaction(stockPrices, buyDay1, sellDay1);
      if (transaction1.profit > 0) {
        permutations.push(new Permutation(transaction1));
      }

      for (let buyDay2 = sellDay1; buyDay2 < stockPrices.length; buyDay2++) {
        for (
          let sellDay2 = buyDay2;
          sellDay2 < stockPrices.length;
          sellDay2++
        ) {
          const transaction2 = new Transaction(stockPrices, buyDay2, sellDay2);
          const permutation = new Permutation(transaction1, transaction2);
          if (permutation.profit > 0) permutations.push(permutation);
        }
      }
    }
  }

  return Math.max(...permutations.map(permutation => permutation.profit));
}
