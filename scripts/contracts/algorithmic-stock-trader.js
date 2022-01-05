// Algorithmic Stock Trader I-IV

// I
// 96,83,172,187,96,195,159,34,141,159,198,22,39,23,75,86,38,129,110,89,75,111,188 -> 166

// III
// 16,171,74,18,34,182,173,19,128,36,43,124,27,163,69,154,34,92,72,152,142,90,200 -> 347

// IV
// [6, [101,22,191,49,3,21,93,155,120,49,48,34,193,52,179,89,77,98,34,189,195,71,175,90,40,134,98,46,91,152,2,103,174,126,82,179,172,56,145,113,165,101,162,55,16,164,111]]
// home; connect iron-gym; connect zer0; connect omega-net; connect crush-fitness; run contract-429500-AlphaEnterprises.cct

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

  let maxProfit = 0;
  for (let buyDay = 0; buyDay < stockPrices.length; buyDay++) {
    const profit = _getTradesPermutations(
      tradesWithPositiveProfits,
      maxTradeCount,
      buyDay,
      0,
      0
    );
    maxProfit = Math.max(profit, maxProfit);
  }
  return maxProfit;
}

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

/**
 * @param {Trade[]} tradesWithPositiveProfits where index is buy day
 * @param {int} buyDay
 * @param {int} maxTradeCount
 * @param {int} tradeCountThusFar
 * @param {int} profitThusFar
 * @return {int} maxProfit
 */
function _getTradesPermutations(
  tradesWithPositiveProfits,
  maxTradeCount,
  buyDay,
  tradeCountThusFar,
  profitThusFar
) {
  if (tradeCountThusFar >= maxTradeCount) return [];
  const availableTrades = tradesWithPositiveProfits[buyDay];
  if (availableTrades.length === 0) return profitThusFar;

  let maxProfit = 0;
  for (const trade of availableTrades) {
    const newProfitThusFar = profitThusFar + trade.profit;
    maxProfit = Math.max(newProfitThusFar, maxProfit);
    for (
      let newBuyDay = trade.sellDay + 1;
      newBuyDay < tradesWithPositiveProfits.length;
      newBuyDay++
    ) {
      const profit = _getTradesPermutations(
        tradesWithPositiveProfits,
        maxTradeCount,
        newBuyDay,
        tradeCountThusFar + 1,
        newProfitThusFar
      );
      maxProfit = Math.max(profit, maxProfit);
    }
  }
  return maxProfit;
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
