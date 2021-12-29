const DEFAULT_PORT = 1337;
const LOCALHOST_PREFIX = 'http://localhost';

/**
 * Syncs all stats to an external dashboard running on localhost.
 *
 * @example run sync-dashboard.js <port>
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  let port = parseInt(ns.args[0]);
  port = isNaN(port) ? DEFAULT_PORT : port;

  while (true) {
    await fetch(`${LOCALHOST_PREFIX}:${port}/dashboard/sync`, {
      method: 'post',
      body: JSON.stringify({ lauren: 'hello world' }),
    });

    await ns.sleep(1000);
  }
}
