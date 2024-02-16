class Transaction {
  constructor(buyDay, sellDay, stockPrices) {
    this.buyDay = buyDay;
    this.sellDay = sellDay;
    this.buyPrice = stockPrices[buyDay];
    this.sellPrice = stockPrices[sellDay];
    this.profit = this.sellPrice - this.buyPrice;
  }

  toString() {
    return `buy ${this.buyDay} ($${this.buyPrice}), sell ${this.sellDay} ($${this.sellPrice})`;
  }
}

class Permutation {
  constructor(...transactions) {
    this.transactions = transactions;
    this.profit = transactions
      .map(transaction => transaction.profit)
      .reduce((a, b) => a + b);
  }

  toString() {
    return (
      '[\n' +
      this.transactions.map(transaction => ` ${transaction}`).join('\n') +
      '\n]'
    );
  }
}

/**
 * Algorithmic Stock Trader I
 *
 * @param {number[]} stockPrices
 *        where the i-th element represents the stock on day i
 * @returns {number} max profit using at most 1 transaction
 */
export const algorithmicStockTraderI = stockPrices =>
  getMaxProfit(stockPrices, 1);

/**
 * Algorithmic Stock Trader II
 *
 * @param {number[]} stockPrices
 *        where the i-th element represents the stock on day i
 * @returns {number} max profit using as many transactions as you'd like
 */
export const algorithmicStockTraderII = stockPrices =>
  getMaxProfit(stockPrices, stockPrices.length);

//  * Algorithmic Stock Trader III
//  *
//  * @param {number[]} stockPrices
//  *        where the i-th element represents the stock on day i
//  * @returns {number} max profit using at most 2 transactions
//  */
// export const algorithmicStockTraderIII = stockPrices =>
//   getMaxProfit(stockPrices, 2);

// /**
//  * Algorithmic Stock Trader IV
//  *
//  * @param {(number, number[])[]} input [k, stockPrices]
//  * @returns {number} max profit using at most k transactions
//  */
// export function algorithmicStockTraderIV(input) {
//   const [k, stockPrices] = input;
//   return getMaxProfit(stockPrices, k);
// }

/**
 *
 * @param {number[]} stockPrices
 * @param {number} transactionCount
 */
function getMaxProfit(stockPrices, transactionCount) {
  const transactions = getPositiveTransactions(stockPrices);
  if (transactions.length === 0) return 0;

  if (transactionCount === 1) {
    return Math.max(...transactions.map(transaction => transaction.profit));
  }

  const sellDayToNextTransactionsMap = {};
  const sellDays = transactions.map(transaction => transaction.sellDay);
  for (const sellDay of sellDays) {
    sellDayToNextTransactionsMap[sellDay] = transactions.filter(
      transaction => transaction.buyDay > sellDay
    );
  }

  const permutations = [];
  for (const transaction of transactions) {
    permutations.push(
      getMostProfitablePermutation(transaction, sellDayToNextTransactionsMap)
    );
  }
  permutations.sort((p1, p2) => p2.profit - p1.profit);
  return permutations[0].profit;
}

/**
 * @param {number[]} stockPrices
 * @returns {Transaction[]} all possible positive profit transactions
 */
function getPositiveTransactions(stockPrices) {
  const transactions = [];
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
      const transaction = new Transaction(buyDay, sellDay, stockPrices);
      if (transaction.profit > 0) transactions.push(transaction);
    }
  }
  return transactions;
}

/**
 * @param {Transaction} transaction
 * @param {Object.<number, Transaction[]>} sellDayToNextTransactionsMap
 * @param {Permutation}
 */
function getMostProfitablePermutation(
  transaction,
  sellDayToNextTransactionsMap
) {
  const permutations = [];
  const nextTransactions = sellDayToNextTransactionsMap[transaction.sellDay];
  if (nextTransactions.length === 0) return new Permutation(transaction);
  for (const nextTransaction of nextTransactions) {
    permutations.push(
      getMostProfitablePermutation(
        nextTransaction,
        sellDayToNextTransactionsMap
      )
    );
  }
  permutations.sort((p1, p2) => p2.profit - p1.profit);
  return new Permutation(transaction, ...permutations[0].transactions);
}
