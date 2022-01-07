const SCRIPTS_TO_RUN = [
  'sync.js',
  'manage-hacking.js',
  'manage-hacknet.js',
  'manage-servers.js',
  'manage-stocks.js',
  'manage-programs.js',
];

/**
 * Script that starts up all managing scripts.
 *
 * @param {import('index').NS} ns
 */
export const main = ns => SCRIPTS_TO_RUN.forEach(script => ns.run(script, 1));
