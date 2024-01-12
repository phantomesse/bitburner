import { getAllHostnames } from 'utils/servers';
import { HOME_HOSTNAME } from 'utils/constants';

/**
 * Stops all scripts and removes JS files from every server except the home
 * server. Also remove database files.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const allHostnames = getAllHostnames(ns);
  for (const hostname of allHostnames) {
    if (hostname === HOME_HOSTNAME) continue;

    // Kill all scripts.
    ns.killall(hostname);

    // Remove files.
    const filenames = ns.ls(hostname, '.js');
    for (const filename of filenames) ns.rm(filename, hostname);
  }

  // Remove database files.
  const filenames = [
    ...ns.ls(HOME_HOSTNAME, '.txt'),
    ...ns.ls(HOME_HOSTNAME, '.cct'),
  ];
  for (const filename of filenames) ns.rm(filename);
}
