import { HOME_HOSTNAME, getAllHostnames } from 'utils';

/**
 * Stops all scripts and removes JS files from every server except the home
 * server.
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
}
