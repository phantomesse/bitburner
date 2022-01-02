/**
 * Grows server until we cannot grow anymore.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const host = ns.args[0];
  while (ns.getServerMoneyAvailable(host) < ns.getServerMaxMoney(host)) {
    await ns.grow(host);
  }
  ns.tprint(
    `finished growing ${host} with ${ns.getServerMoneyAvailable(host)}`
  );
}

export const autocomplete = data => [...data.servers];
