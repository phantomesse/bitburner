import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';

/**
 * Continuously buys back shares from the corporation.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);
    const sharesToBuy = Math.min(
      Math.floor(
        moneyAvailable / (ns.corporation.getCorporation().sharePrice * 1.1)
      ),
      ns.corporation.getCorporation().totalShares -
        ns.corporation.getCorporation().numShares
    );
    try {
      ns.corporation.buyBackShares(sharesToBuy);
    } catch (e) {
      ns.toast(`${e}`, 'error', 30 * ONE_SECOND);
    }
    await ns.sleep(ONE_SECOND);
  }
}
