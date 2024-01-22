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
  return getMaxProfit(stockPrices, k);
}

/**
 * @param {number[]} stockPrices
 * @param {number} maxTransactions
 * @returns {number} max profit
 */
function getMaxProfit(stockPrices, maxTransactions) {
  // Get all profitable transactions.
  const buyDayToProfitableTransactions = {};
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    buyDayToProfitableTransactions[buyDay] = getProfitableTransactions(
      buyDay,
      stockPrices
    );
  }

  // If there aren't any profitable transactions, return 0.
  if (
    Object.values(buyDayToProfitableTransactions).filter(
      transactions => transactions.length > 0
    ).length === 0
  ) {
    return 0;
  }

  /** @type {Permutation[]} */ const permutations = [];
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {}
  console.log(buyDayToProfitableTransactions);
}

console.log(
  algorithmicStockTraderI([
    119, 161, 114, 148, 145, 155, 87, 85, 100, 1, 3, 79, 65, 31, 43, 98, 177,
    183, 65, 44,
  ])
);

/**
 * @typedef Transaction
 * @property {number} buyDay
 * @property {number} sellDay
 * @property {number} profit
 *
 * @typedef {Transaction[]} Permutation
 */

/**
 * @param {Transaction} transaction
 * @param {number} maxTransactions
 * @param {Object.<number, Transaction[]>} buyDayToProfitableTransactions
 * @returns {Permutation[]}
 *          all profitable permutations starting from the given transaction
 */
function getProfitablePermutations(
  transaction,
  maxTransactions,
  buyDayToProfitableTransactions
) {
  const permutations = [[transaction]];
  if (maxTransactions === 1) return permutations;

  const lastBuyDay = Math.max(...Object.keys(buyDayToProfitableTransactions));
  for (let buyDay = transaction.sellDay + 1; buyDay <= lastBuyDay; buyDay++) {
    const nextTransactions = buyDayToProfitableTransactions[buyDay];
    if (nextTransactions.length === 0) continue;

    for (const nextTransaction of nextTransactions) {
      const nextPermutations = getProfitablePermutations();
    }
  }

  return permutations;
}

/**
 * @param {number} buyDay
 * @param {number[]} stockPrices
 * @returns {Transaction[]}
 *          all transactions starting from given buy day that are profitable
 */
function getProfitableTransactions(buyDay, stockPrices) {
  const transactions = [];
  const buyPrice = stockPrices[buyDay];
  for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
    const sellPrice = stockPrices[sellDay];
    const profit = sellPrice - buyPrice;
    if (profit <= 0) continue;
    transactions.push(/** @type {Transaction} */ { buyDay, sellDay, profit });
  }
  return transactions;
}
