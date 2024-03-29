import { UPDATE_SERVERS_SCRIPT, queueScript } from 'utils/scripts';

/**
 * @param {NS} ns
 */
export function main(ns) {
  ns.run('reserve-ram.js', {}, 0);
  ns.run('manage-scripts.js', { preventDuplicates: true });

  queueScript(ns, UPDATE_SERVERS_SCRIPT);
  queueScript(ns, 'gain-access.js');
  queueScript(ns, 'manage-hacking.js');

  if (ns.getPurchasedServerLimit() > 0) queueScript(ns, 'manage-servers.js');

  queueScript(ns, 'manage-hacknet.js');
  queueScript(ns, 'manage-hashes.js');
  queueScript(ns, 'buy-programs.js');
  queueScript(ns, 'manage-sleeves.js');
}
