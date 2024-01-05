export class Transaction {
  constructor(buyDay, sellDay, stockPrices) {
    this.buyDay = buyDay;
    this.buyPrice = stockPrices[buyDay];

    this.sellDay = sellDay;
    this.sellPrice = stockPrices[sellDay];

    this.profit = this.sellPrice - this.buyPrice;
  }

  toString() {
    return [
      `buy day ${this.buyDay} ($${this.buyPrice})`,
      `sell day ${this.sellDay} ($${this.sellPrice})`,
      `profit $${this.profit}`,
    ].join(', ');
  }
}

export class Permutation {
  /**
   * @param  {...Transaction} transactions
   */
  constructor(...transactions) {
    this.transactions = transactions;
    this.profit = transactions
      .map(transaction => transaction.profit)
      .reduce((a, b) => a + b);
  }

  toString() {
    return [
      '\n{',
      `  ${this.transactions.length} transactions, total profit $${this.profit}`,
      ...this.transactions.map(transaction => `  ${transaction}`),
      '}',
    ].join('\n');
  }
}

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
export function algorithmicStockTraderI(stockPrices) {
  return getMaxProfit(stockPrices, 1);
}

/**
 * Algorithmic Stock Trader II
 *
 * You are given the following array of stock prices (which are numbers) where
 * the i-th element represents the stock price on day i:
 *
 * 103,150,154,3,98,150,182,97,41,96,99,1,1,28,66,19,51,4,172,22,199,40,93,33,185,96,158,123,47,76,18,93,103,126,120,92,194,126,97,124,34,86,29,22,73,156,27,18
 *
 * Determine the maximum possible profit you can earn using as many transactions
 * as you'd like. A transaction is defined as buying and then selling one share
 * of the stock. Note that you cannot engage in multiple transactions at once.
 * In other words, you must sell the stock before you buy it again.
 *
 * If no profit can be made, then the answer should be 0
 *
 * @param {number[]} stockPrices
 * @returns {number} profit
 */
export function algorithmicStockTraderII(stockPrices) {
  return getMaxProfit(stockPrices);
}

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
export function algorithmicStockTraderIII(stockPrices) {
  return getMaxProfit(stockPrices, 2);
}

/**
 * Algorithmic Stock Trader IV
 *
 * You are given the following array with two elements:
 *
 * [9, [164,113,142,36,159,53,111,154,6,61,134,22,195,142,7,39,190,28,112,140,17,156,88,78,88]]
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
 * @param {(number, number[])[]} input [k, stockPrices]
 * @returns {number} profit
 */
export function algorithmicStockTraderIV(input) {
  const [maxTransactions, stockPrices] = input;
  return getMaxProfit(stockPrices, maxTransactions);
}

/**
 * @param {number[]} stockPrices
 * @param {[number]} maxTransactions
 */
function getMaxProfit(stockPrices, maxTransactions) {
  const buyDayToPermutationMap = {};
  const permutations = [];
  for (let buyDay = 0; buyDay < stockPrices.length - 1; buyDay++) {
    permutations.push(
      ...getProfitablePermutation(
        buyDay,
        stockPrices,
        buyDayToPermutationMap,
        maxTransactions
      )
    );
  }
  permutations.sort((a, b) => b.profit - a.profit);
  console.log(`${permutations[0]}`);
  return permutations[0].profit;
}

/**
 * @param {number} buyDay
 * @param {number[]} stockPrices
 * @param {Object.<number, Permutation[]>} buyDayToPermutationMap
 * @param {number} maxTransactions
 * @returns {Permutation} profitable permutations
 */
function getProfitablePermutation(
  buyDay,
  stockPrices,
  buyDayToPermutationMap,
  maxTransactions
) {
  if (buyDay in buyDayToPermutationMap) return buyDayToPermutationMap[buyDay];

  const permutations = [];
  for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
    const transaction = new Transaction(buyDay, sellDay, stockPrices);
    if (transaction.profit <= 0) continue;
    permutations.push(new Permutation(transaction));
    if (maxTransactions === 1) continue;

    for (
      let nextBuyDay = sellDay + 1;
      nextBuyDay < stockPrices.length - 1;
      nextBuyDay++
    ) {
      const nextBuyDayPermutations = getProfitablePermutation(
        nextBuyDay,
        stockPrices,
        buyDayToPermutationMap,
        maxTransactions ? maxTransactions - 1 : maxTransactions
      );
      if (nextBuyDayPermutations.length === 0) continue;
      nextBuyDayPermutations.sort((a, b) => b.profit - a.profit);

      // for (const permutation of nextBuyDayPermutations) {
      //   permutations.push(
      //     new Permutation(transaction, ...permutation.transactions)
      //   );
      // }

      permutations.push(
        new Permutation(transaction, ...nextBuyDayPermutations[0].transactions)
      );
    }
  }
  permutations.sort((a, b) => b.profit - a.profit);
  buyDayToPermutationMap[buyDay] = permutations;
  return permutations;
}

console.log(
  algorithmicStockTraderIII([
    177, 124, 184, 55, 108, 175, 3, 102, 77, 54, 170, 130, 141, 157,
  ])
);
