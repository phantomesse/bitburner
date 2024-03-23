class Transaction {
  /**
   * @param {number} buyDay
   * @param {number} sellDay
   * @param {number[]} stockPrices
   */
  constructor(buyDay, sellDay, stockPrices) {
    this.buyDay = buyDay;
    this.buyPrice = stockPrices[buyDay];
    this.sellDay = sellDay;
    this.sellPrice = stockPrices[sellDay];
    this.profit = this.sellPrice - this.buyPrice;
  }

  toString() {
    return [
      `buy ${this.buyDay} ($${this.buyPrice})`,
      `sell ${this.sellDay} ($${this.sellPrice})`,
      `profit $${this.profit}`,
    ].join(',\t');
  }
}

class Permutation {
  /**
   * @param {Transaction[]} transactions
   */
  constructor(transactions) {
    this.transactions = transactions;
    this.profit = transactions
      .map(transaction => transaction.profit)
      .reduce((a, b) => a + b);
  }

  toString() {
    return `${this.transactions.length} transactions ($${this.profit})`;
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
export const algorithmicStockTraderII = stockPrices => {
  if (stockPrices.length > 25) return 0; // TODO
  return getMaxProfit(stockPrices, stockPrices.length);
};

/**
 * Algorithmic Stock Trader III
 *
 * @param {number[]} stockPrices
 *        where the i-th element represents the stock on day i
 * @returns {number} max profit using at most 2 transactions
 */
export const algorithmicStockTraderIII = stockPrices =>
  getMaxProfit(stockPrices, 2);

/**
 * Algorithmic Stock Trader IV
 *
 * @param {(number, number[])[]} input [k, stockPrices]
 * @returns {number} max profit using at most k transactions
 */
export function algorithmicStockTraderIV(input) {
  const [k, stockPrices] = input;
  if (stockPrices.length > 25) return 0; // TODO
  return getMaxProfit(stockPrices, k);
}

/**
 *
 * @param {number[]} stockPrices
 *        where the i-th element represents the stock on day i
 * @param {number} maxTransactions maximum number of transactions to make
 */
function getMaxProfit(stockPrices, maxTransactions) {
  const mostProfitableTransaction = getMostProfitableTransaction(stockPrices);
  if (!mostProfitableTransaction) return 0;
  if (maxTransactions === 1) return mostProfitableTransaction.profit;

  const permutations = getPermutations(stockPrices, maxTransactions);
  return permutations[0].profit;
}

/**
 * @param {number[]} stockPrices
 * @returns {Transaction} most profitable transaction
 */
function getMostProfitableTransaction(stockPrices) {
  let mostProfitableTransaction;
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
      const transaction = new Transaction(buyDay, sellDay, stockPrices);
      if (transaction.profit <= 0) continue;
      if (
        mostProfitableTransaction === undefined ||
        transaction.profit > mostProfitableTransaction.profit
      ) {
        mostProfitableTransaction = transaction;
      }
    }
  }
  return mostProfitableTransaction;
}

/**
 * @param {number[]} stockPrices
 * @returns {Transaction[]} transactions that have positive profits
 */
function getProfitableTransactions(stockPrices) {
  if (stockPrices in profitableTransactionsCache) {
    return profitableTransactionsCache[stockPrices];
  }
  const profitableTransactions = [];
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
      const transaction = new Transaction(buyDay, sellDay, stockPrices);
      if (transaction.profit <= 0) continue;
      profitableTransactions.push(transaction);
    }
  }
  profitableTransactionsCache[stockPrices] = profitableTransactions;
  return profitableTransactions;
}
const profitableTransactionsCache = {};

/**
 *
 * @param {number[]} stockPrices
 * @param {number} maxTransactions
 * @param {...Transaction} transactions
 * @returns {Permutation[]} all possible permutations
 */
function getPermutations(stockPrices, maxTransactions, ...transactions) {
  if (stockPrices.length < 2) {
    return transactions.length === 0 ? [] : [new Permutation(transactions)];
  }

  const nextTransactions = getProfitableTransactions(stockPrices);
  if (
    nextTransactions.length === 0 ||
    transactions.length === maxTransactions
  ) {
    return transactions.length === 0 ? [] : [new Permutation(transactions)];
  }

  const allPermutations = [];
  for (const nextTransaction of nextTransactions) {
    const newStockPrices = stockPrices.slice(nextTransaction.sellDay + 1);
    const permutations = getPermutations(
      newStockPrices,
      maxTransactions,
      ...transactions,
      nextTransaction
    );
    permutations.sort(
      (permutation1, permutation2) => permutation2.profit - permutation1.profit
    );
    allPermutations.push(permutations[0]);
  }
  allPermutations.sort(
    (permutation1, permutation2) => permutation2.profit - permutation1.profit
  );
  return [allPermutations[0]];
}
