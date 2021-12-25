/**
 * Retrieves all servers including `home` and personal servers.
 *
 * @example getAllServers(ns)
 * @param {import('..').NS } ns
 * @param {string} [root]
 * @param {string} [parent]
 * @returns {Set<string>}
 */
export function getAllServers(ns, root, parent) {
  if (parent === undefined) parent = 'home';
  const children = ns.scan(root).filter(child => child !== parent);
  let servers = new Set(children);
  for (const child of children) {
    servers = new Set([...servers, ...getAllServers(ns, child, root)]);
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

/** @param {import('..').NS } ns */
export function sortByHackGrowWeakenTime(ns, hosts) {
  hosts.sort(
    (server1, server2) =>
      ns.getHackTime(server1) +
      ns.getWeakenTime(server1) +
      ns.getGrowTime(server1) -
      ns.getHackTime(server2) -
      ns.getWeakenTime(server2) -
      ns.getGrowTime(server2)
  );
}
