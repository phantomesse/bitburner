const SCRIPTS_TO_RUN = [
  'manage-hacking.js',
  'manage-hacknet.js',
  'manage-life.js',
  'manage-programs.js',
  'manage-servers.js',
  'manage-stocks.js',
];

/**
 * Script that starts up all managing scripts.
 *
 * @param {import('index').NS} ns
 */
export const main = ns => SCRIPTS_TO_RUN.forEach(script => ns.run(script, 1));
