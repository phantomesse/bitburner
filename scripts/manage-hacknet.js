import { UPDATE_SERVERS_SCRIPT, queueScript } from 'utils/scripts';
import { ONE_SECOND } from 'utils/time';

/**
 * Buy & upgrade Hacknet servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Purchase new nodes.
    let nodeIndex;
    do {
      nodeIndex = ns.hacknet.purchaseNode();
      if (nodeIndex !== -1) {
        queueScript(ns, UPDATE_SERVERS_SCRIPT);
        ns.toast(`Purchased hacknet-node-${nodeIndex}`);
      }
    } while (nodeIndex !== -1);

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      // Upgrade level.
      upgrade(() => ns.hacknet.upgradeLevel(i));

      // Upgrade cache level.
      upgrade(() => ns.hacknet.upgradeCache(i));

      let wasSuccessfulAtLeastOnce = false;

      // Upgrade ram.
      let wasSuccessful = upgrade(() => ns.hacknet.upgradeRam(i));
      if (wasSuccessful) wasSuccessfulAtLeastOnce = true;

      // Upgrade cores.
      wasSuccessful = upgrade(() => ns.hacknet.upgradeCore(i));
      if (wasSuccessful) wasSuccessfulAtLeastOnce = true;

      if (wasSuccessfulAtLeastOnce) queueScript(ns, UPDATE_SERVERS_SCRIPT);
    }

    await ns.sleep(ONE_SECOND);
  }
}

/**
 * @param {function():boolean} upgradeFn
 * @returns {boolean} whether the upgrade was successful at least once
 */
function upgrade(upgradeFn) {
  let wasSuccessfulAtLeastOnce = false;

  let wasSuccessful;
  do {
    wasSuccessful = upgradeFn();
    if (wasSuccessful) wasSuccessfulAtLeastOnce = true;
  } while (wasSuccessful);

  return wasSuccessfulAtLeastOnce;
}
