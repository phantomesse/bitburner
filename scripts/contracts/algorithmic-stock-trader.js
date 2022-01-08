/**
 * Algorithmic Stock Trader I
 *
 * @param {number[]} input stock prices
 * @returns {number} max profit
 */
export const algorithmicStockTraderI = input => _getMaxProfit(1, input);

/**
 * Algorithmic Stock Trader II
 *
 * @param {number[]} input stock prices
 * @returns {number} max profit
 */
export const algorithmicStockTraderII = input =>
  _getMaxProfit(input.length, input);

/**
 * Algorithmic Stock Trader III
 *
 * @param {number[]} input stock prices
 * @returns {number} max profit
 */
export const algorithmicStockTraderIII = input => _getMaxProfit(2, input);

/**
 * Algorithmic Stock Trader IV
 *
 * @param {any[]} input where the first element is the number of trade counts
 *                      and the second element is the stock prices
 * @returns {number} max profit
 */
export const algorithmicStockTraderIV = input =>
  _getMaxProfit(input[0], input[1]);

/**
 * @param {number} maxTradeCount
 * @param {number[]} stockPrices
 * @returns {number} max profit
 */
function _getMaxProfit(maxTradeCount, stockPrices) {
  const tradesWithPositiveProfits = Array(stockPrices.length); // Index is buy day
  for (let buyDay = 0; buyDay < stockPrices.length; buyDay++) {
    tradesWithPositiveProfits[buyDay] = _getTradesWithPositiveProfit(
      stockPrices,
      buyDay
    );
  }

  const tradePermutations = Array(stockPrices.length); // Index is buy day.
  for (let buyDay = stockPrices.length - 1; buyDay >= 0; buyDay--) {
    const availableTrades = tradesWithPositiveProfits[buyDay];
    tradePermutations[buyDay] = availableTrades.map(trade => [trade]);

    if (buyDay === stockPrices.length - 1) continue;

    const futureTradePermutations = tradePermutations[buyDay + 1];
    for (const futureTradePermutation of futureTradePermutations) {
      tradePermutations[buyDay].push(futureTradePermutation);
      if (futureTradePermutation.length === maxTradeCount) continue;

      for (const availableTrade of availableTrades) {
        if (availableTrade.sellDay <= futureTradePermutation[0].buyDay) {
          tradePermutations[buyDay].push([
            availableTrade,
            ...futureTradePermutation,
          ]);
        }
      }
    }

    // Trim permutations so that only one permutation of each length and
    // buy day (where the chosen permutation is the one with the max profit)
    /** @type {Object.<number, Permutation[]>} */
    const buyDayToPermutationsMap = {};
    for (const permutation of tradePermutations[buyDay]) {
      const key = permutation[0].buyDay;
      if (!(key in buyDayToPermutationsMap)) buyDayToPermutationsMap[key] = [];
      buyDayToPermutationsMap[key].push(permutation);
    }
    const permutationsToKeep = [];
    for (const permutations of Object.values(buyDayToPermutationsMap)) {
      const lengthToBestPermutationMap = {};
      const lengthToMaxProfitMap = {};
      for (const permutation of permutations) {
        const length = permutation.length;
        const profit = permutation
          .map(trade => trade.profit)
          .reduce((a, b) => a + b, 0);
        if (
          !(length in lengthToMaxProfitMap) ||
          profit > lengthToMaxProfitMap[length]
        ) {
          lengthToMaxProfitMap[length] = profit;
          lengthToBestPermutationMap[length] = permutation;
        }
      }
      permutationsToKeep.push(...Object.values(lengthToBestPermutationMap));
    }
    tradePermutations[buyDay] = permutationsToKeep;
  }

  return Math.max(
    ...tradePermutations[0].map(trades =>
      trades.map(trade => trade.profit).reduce((a, b) => a + b, 0)
    )
  );
}

/**
 * @typedef {Trade[]} Permutation
 */

/**
 * @typedef {Object} Trade
 * @property {number} buyDay
 * @property {number} sellDay
 * @property {number} profit
 */

/**
 * @param {number[]} stockPrices
 * @param {number} buyDay
 * @returns {Trade[]} trades with positive profit
 */
function _getTradesWithPositiveProfit(stockPrices, buyDay) {
  const buyPrice = stockPrices[buyDay];
  const trades = [];
  for (let sellDay = buyDay + 1; sellDay < stockPrices.length; sellDay++) {
    const sellPrice = stockPrices[sellDay];
    const profit = sellPrice - buyPrice;
    if (profit > 0) {
      trades.push({ buyDay: buyDay, sellDay: sellDay, profit: profit });
    }
  }
  return trades;
}
