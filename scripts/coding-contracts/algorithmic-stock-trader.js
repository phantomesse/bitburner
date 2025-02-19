/**
 * Algorithmic Stock Trader I
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 11,48,117,172,83,35,116,11,150,177,80,170,72,75,55,158,100,22,15,127,87,75,150
 *
 * Determine the maximum possible profit you can earn using at most one
 * transaction (i.e. you can only buy and sell the stock once). If no profit can
 * be made then the answer should be 0. Note that you have to buy the stock
 * before you can sell it.
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveAlgorithmicStockTraderI(input) {
  return getMaxProfit(input, 1);
}

/**
 * Algorithmic Stock Trader III
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 84,111,44,168,176,36,116,157,122,139,169,44,179,81,21,145,71,107,68,166,153,106,59,164,63
 *
 * Determine the maximum possible profit you can earn using at most two
 * transactions. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 *
 * If no profit can be made, then the answer should be 0.
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveAlgorithmicStockTraderIII(input) {
  return getMaxProfit(input, 2);
}

/**
 * Algorithmic Stock Trader IV
 *
 * You are given the following array with two elements:
 *
 * [6, [9,127,18,146,9,129,27,13,14,121,112,174,138,166,38]]
 *
 * The first element is an integer k. The second element is an array of stock
 * prices (which are numbers) where the i-th element represents the stock price
 * on day i.
 *
 * Determine the maximum possible profit you can earn using at most k
 * transactions. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you can buy it again.
 *
 * If no profit can be made, then the answer should be 0.
 *
 * @param {[number, number[]]} input
 * @returns {number}
 */
export function solveAlgorithmicStockTraderIV(input) {
  const [maxTransactionCount, stockPrices] = input;
  return getMaxProfit(stockPrices, maxTransactionCount);
}

/**
 * @param {number[]} stockPrices
 * @param {number} maxTransactionCount
 * @param {number = 0} profitThusFar
 * @returns {number}
 */
function getMaxProfit(stockPrices, maxTransactionCount, profitThusFar = 0) {
  if (stockPrices.length === 0 || maxTransactionCount === 0) {
    return profitThusFar;
  }

  /** @type {Transaction[]} */ const allPositiveProfitTransactions = [];
  /** @type {Object<number, Transaction[]>} */ const buyDayToTransactionsMap =
    {};
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    buyDayToTransactionsMap[buyDay] = [];

    for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
      const transaction = new Transaction(buyDay, sellDay, stockPrices);
      if (transaction.profit > 0) {
        allPositiveProfitTransactions.push(transaction);
        buyDayToTransactionsMap[buyDay].push(transaction);
      }
    }
  }

  let maxProfit = 0;
  for (const transaction of allPositiveProfitTransactions) {
    const newStockPrices = stockPrices.slice(transaction.sellDay + 1);
    const profit =
      profitThusFar +
      transaction.profit +
      getMaxProfit(newStockPrices, maxTransactionCount - 1);
    if (profit > maxProfit) maxProfit = profit;
  }
  return maxProfit;
}

class Transaction {
  /**
   * @param {number} buyDay
   * @param {number} sellDay
   * @param {number[]} stockPrices
   */
  constructor(buyDay, sellDay, stockPrices) {
    /** @type {number} */ this.buyDay = buyDay;
    /** @type {number} */ this.sellDay = sellDay;
    /** @type {number} */ this.buyPrice = stockPrices[buyDay];
    /** @type {number} */ this.sellPrice = stockPrices[sellDay];
    /** @type {number} */ this.profit = this.sellPrice - this.buyPrice;
  }
}
