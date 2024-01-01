/** Percent of max money that is acceptable for hacking. */
const MIN_MONEY_PERCENT = 0.5;
const MIN_MONEY_AMOUNT = 1000000;

/**
 * Hacks a server defined in the argument, weakening and growing whenever
 * necessary.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('getServerMaxMoney');
  ns.disableLog('getServerSecurityLevel');
  ns.disableLog('getServerMinSecurityLevel');
  ns.disableLog('getServerBaseSecurityLevel');
  ns.disableLog('getHackingLevel');
  ns.disableLog('getServerRequiredHackingLevel');

  const hostname = ns.args[0];

  while (true) {
    const availableMoneyAmount = ns.getServerMoneyAvailable(hostname);
    const moneyPercent = availableMoneyAmount / ns.getServerMaxMoney(hostname);
    const hasEnoughMoney =
      moneyPercent >= MIN_MONEY_PERCENT ||
      availableMoneyAmount >= MIN_MONEY_AMOUNT;

    const currentSecurityLevel = ns.getServerSecurityLevel(hostname);
    const minSecurityLevel = ns.getServerMinSecurityLevel(hostname);
    const isWeakEnough =
      currentSecurityLevel <= ns.getServerBaseSecurityLevel(hostname);

    const isHackable =
      ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hostname);

    if (isHackable && hasEnoughMoney && isWeakEnough) {
      await ns.hack(hostname);
    }

    if (!hasEnoughMoney || (!isHackable && moneyPercent < 1)) {
      await ns.grow(hostname);
    }

    if (
      !isWeakEnough ||
      (!isHackable && currentSecurityLevel > minSecurityLevel)
    ) {
      await ns.weaken(hostname);
    }
  }
}
