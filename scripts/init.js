import { queueScript } from 'utils/scripts';

/**
 * @param {NS} ns
 */
export function main(ns) {
  ns.run('manage-scripts.js', { preventDuplicates: true });

  queueScript(ns, 'update-servers.js');
  queueScript(ns, 'gain-access.js');
  queueScript(ns, 'manage-hacking.js');
}
