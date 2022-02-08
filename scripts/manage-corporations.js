/**
 * Manages a corporation.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  ns.tprint(
    ns.corporation.getOffice('Agriculture Division', 'Sector-12').employees
  );
}
