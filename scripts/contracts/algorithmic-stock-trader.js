// Algorithmic Stock Trader I-IV

// I
// 96,83,172,187,96,195,159,34,141,159,198,22,39,23,75,86,38,129,110,89,75,111,188 -> 166

// III
// 16,171,74,18,34,182,173,19,128,36,43,124,27,163,69,154,34,92,72,152,142,90,200 -> 347

// IV
// [6, [101,22,191,49,3,21,93,155,120,49,48,34,193,52,179,89,77,98,34,189,195,71,175,90,40,134,98,46,91,152,2,103,174,126,82,179,172,56,145,113,165,101,162,55,16,164,111]] -> 972

export const algorithmicStockTraderI = input => _getMaxProfit(1, input);
export const algorithmicStockTraderII = input =>
  _getMaxProfit(input.length, input);
export const algorithmicStockTraderIII = input => _getMaxProfit(2, input);
export const algorithmicStockTraderIV = input =>
  _getMaxProfit(input[0], input[1]);

/**
 * @param {int} maxTradeCount
 * @param {int[]} stockPrices
 * @returns {int} max profit
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
    /** @type {Object.<int, Permutation[]>} */
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
 * @property {int} buyDay
 * @property {int} sellDay
 * @property {int} profit
 */

/**
 * @param {int[]} stockPrices
 * @param {int} buyDay
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

let input = [
  96, 83, 172, 187, 96, 195, 159, 34, 141, 159, 198, 22, 39, 23, 75, 86, 38,
  129, 110, 89, 75, 111, 188,
];
console.log(algorithmicStockTraderI(input));

input = [
  16, 171, 74, 18, 34, 182, 173, 19, 128, 36, 43, 124, 27, 163, 69, 154, 34, 92,
  72, 152, 142, 90, 200,
];
console.log(algorithmicStockTraderIII(input));

input = [
  6,
  [
    101, 22, 191, 49, 3, 21, 93, 155, 120, 49, 48, 34, 193, 52, 179, 89, 77, 98,
    34, 189, 195, 71, 175, 90, 40, 134, 98, 46, 91, 152, 2, 103, 174, 126, 82,
    179, 172, 56, 145, 113, 165, 101, 162, 55, 16, 164, 111,
  ],
];
console.log(algorithmicStockTraderIV(input));
