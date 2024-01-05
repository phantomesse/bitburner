import { getServers } from 'database/servers';

const STOCKS_FILENAME = 'database/stocks.txt';

/**
 * @typedef Stock
 * @property {string} symbol
 * @property {string} organization
 * @property {string} server
 * @property {number} maxShares
 */

/**
 * Writes all stock symbols to file.
 *
 * @param {NS} ns
 */
export function writeStocks(ns) {
  const servers = getServers(ns);
  const organizationToServerMap = {};
  for (const server of servers) {
    organizationToServerMap[server.organization] = server.hostname;
  }

  const stocks = ns.stock.getSymbols().map(symbol => {
    const organization = ns.stock.getOrganization(symbol);
    return {
      symbol: symbol,
      organization: organization,
      server: organizationToServerMap[organization],
      maxShares: ns.stock.getMaxShares(symbol),
    };
  });
  ns.write(STOCKS_FILENAME, JSON.stringify(stocks), 'w');
}

/**
 * @param {NS} ns
 * @returns {Stock[]}
 */
export function getStocks(ns) {
  return JSON.parse(ns.read(STOCKS_FILENAME) || '[]');
}
