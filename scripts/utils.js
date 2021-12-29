/**
 * Retrieves all servers including personal servers but excluding 'home'.
 *
 * @example getAllServers(ns)
 * @param {import('..').NS } ns
 * @param {string} [root]
 * @param {string} [parent]
 * @returns {Set<string>}
 */
export function getAllServerNames(ns, root, parent) {
  if (parent === undefined) parent = 'home';
  const children = ns.scan(root).filter(child => child !== parent);
  let servers = new Set(children);
  for (const child of children) {
    servers = new Set([...servers, ...getAllServerNames(ns, child, root)]);
  }
  return servers;
}

/**
 * Formats money.
 *
 * @param {float} money
 * @returns {string}
 */
export function formatMoney(money) {
  return money.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * Formats a percentage within two decimals.
 *
 * @param {float} percent
 * @returns {string}
 */
export function formatPercent(percent) {
  return (percent * 100).toFixed(2) + '%';
}

export function formatTime(timeMs) {
  const minutes = parseInt(timeMs / 1000 / 60);
  const seconds = parseInt((timeMs - minutes * 1000 * 60) / 1000);
  return (minutes > 0 ? `${minutes}m ` : '') + `${seconds}s`;
}

/**
 * Returns whether a server is hackable.
 *
 * @param {import('..').NS } ns
 * @param {string} serverName
 */
export function isHackable(ns, serverName) {
  return (
    ns.getServerMaxMoney(serverName) > 0 &&
    ns.hasRootAccess(serverName) &&
    ns.getServerRequiredHackingLevel(serverName) <= ns.getHackingLevel()
  );
}

/** @param {import('..').NS } ns */
export function sortByHackingHeuristic(ns, hosts) {
  hosts.sort(
    (server1, server2) =>
      getHackingHeuristic(ns, server2) - getHackingHeuristic(ns, server1)
  );
  return hosts;
}

/** @param {import('..').NS } ns */
export function getHackingHeuristic(ns, host) {
  return (
    ns.hackAnalyzeChance(host) *
    ns.hackAnalyze(host) *
    ns.getHackTime(host) *
    ns.getServerMoneyAvailable(host)
  );
}
