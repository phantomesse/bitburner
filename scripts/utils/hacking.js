/** Utils for hacking servers. */
import { HOME_SERVER_NAME, PURCHASED_SERVER_PREFIX } from '/utils/servers.js';

export const GROW_SCRIPT = 'grow.js';
export const WEAKEN_SCRIPT = 'weaken.js';
export const HACK_SCRIPT = 'hack.js';

/**
 * Returns whether a server is hackable.
 *
 * Note that we are using {@link PURCHASED_SERVER_PREFIX} instead of getting the
 * purchased servers list here in order to save on 2.25GB of RAM. This requires
 * that all purchased servers have the same prefix.
 *
 * @param {import('../index').NS } ns
 * @param {string} serverName
 * @returns {boolean} true if the server is hackable, false if otherwise
 */
export function isHackable(ns, serverName) {
  return (
    serverName !== HOME_SERVER_NAME &&
    !serverName.startsWith(PURCHASED_SERVER_PREFIX) &&
    ns.getServerMaxMoney(serverName) > 0 &&
    ns.hasRootAccess(serverName) &&
    ns.getServerRequiredHackingLevel(serverName) <= ns.getHackingLevel()
  );
}

/**
 * A heuristic that determines how hackable a server is.
 *
 * @param {import('../index').NS } ns
 * @param {string} serverName
 * @returns {number} higher number means better to hack
 */
export function getHackingHeuristic(ns, serverName) {
  let heuristic =
    (ns.hackAnalyzeChance(serverName) *
      ns.hackAnalyze(serverName) *
      ns.getServerMoneyAvailable(serverName)) /
    ns.getHackTime(serverName);
  try {
    heuristic *= ns.formulas.hacking.hackExp(
      ns.getServer(serverName),
      ns.getPlayer()
    );
  } catch (_) {}
  return heuristic;
}
