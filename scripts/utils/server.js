export const HOME_SERVER_NAME = 'home';
export const PURCHASED_SERVER_PREFIX = 'lauren';

/**
 * @param {NS} ns
 * @param {string = HOME_SERVER_NAME} rootServerName
 * @param {string} [prevServerName]
 * @returns {string[]} all server names
 */
export function getAllServerNames(
  ns,
  rootServerName = HOME_SERVER_NAME,
  prevServerName
) {
  const nextServerNames = ns
    .scan(rootServerName)
    .filter((serverName) => serverName !== prevServerName);

  const allServerNames = new Set([rootServerName, ...nextServerNames]);

  for (const nextServerName of nextServerNames) {
    if (nextServerName === rootServerName) continue;
    getAllServerNames(ns, nextServerName, rootServerName).forEach(
      (serverName) => allServerNames.add(serverName)
    );
  }

  return [...allServerNames];
}

/**
 * @param {NS} ns
 * @param {string} rootServerName
 * @param {string} targetServerName
 * @param {string} [prevServerName]
 * @returns {string[]} servers to connect to from the given root server to get
 *                     to the target server
 */
export function getPath(ns, rootServerName, targetServerName, prevServerName) {
  const nextServerNames = ns
    .scan(rootServerName)
    .filter((serverName) => serverName !== prevServerName);
  if (nextServerNames.includes(targetServerName)) return [targetServerName];

  for (const nextServerName of nextServerNames) {
    const path = getPath(ns, nextServerName, targetServerName, rootServerName);
    if (path.includes(targetServerName)) return [nextServerName, ...path];
  }
  return [];
}

/**
 * @param {string} serverName
 * @returns {boolean} whether we purchased this server
 */
export function isPurchased(serverName) {
  return (
    serverName === HOME_SERVER_NAME &&
    serverName.startsWith(PURCHASED_SERVER_PREFIX)
  );
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {boolean} whether a server can be hacked
 */
export function isHackable(ns, serverName) {
  const currentHackingLevel = ns.getHackingLevel();

  return (
    !isPurchased(serverName) &&
    ns.hasRootAccess(serverName) &&
    ns.getServerMaxMoney(serverName) > 0 &&
    ns.getServerRequiredHackingLevel(serverName) <= currentHackingLevel
  );
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {number} score based on how worth it it is to hack where a higher
 *                   score means that it is better to hack
 */
export function getHackScore(ns, serverName) {
  const maxMoney = ns.getServerMaxMoney(serverName);
  const availableMoney = ns.getServerMoneyAvailable(serverName);
  if (availableMoney / maxMoney < 0.1) return 0;

  return (
    (ns.hackAnalyze(serverName) *
      ns.hackAnalyzeChance(serverName) *
      (availableMoney / maxMoney) *
      1000000000000) /
    Math.pow(ns.getHackTime(serverName), 2)
  );
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {number} score based on how worth it it is to grow where a higher
 *                   score means that it is better to grow
 */
export function getGrowScore(ns, serverName) {
  const maxMoney = ns.getServerMaxMoney(serverName);
  const availableMoney = ns.getServerMoneyAvailable(serverName);
  if (availableMoney / maxMoney >= 0.9) return 0;

  const growThreadCount = ns.growthAnalyze(
    serverName,
    maxMoney / availableMoney
  );
  return (
    (1 /
      growThreadCount /
      Math.pow(ns.getGrowTime(serverName), 2) /
      ns.growthAnalyzeSecurity(growThreadCount)) *
    1000000000000000
  );
}

/**
 * @param {NS} ns
 * @param {string} serverName
 * @returns {number} score based on how worth it it is to weaken where a higher
 *                   score means that it is better to weaken
 */
export function getWeakenScore(ns, serverName) {
  const currentSecurityLevel = ns.getServerSecurityLevel(serverName);
  const minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
  if (currentSecurityLevel === minSecurityLevel) return 0;

  return (
    (currentSecurityLevel - minSecurityLevel) /
    Math.pow(ns.getWeakenTime(serverName), 2)
  );
}
