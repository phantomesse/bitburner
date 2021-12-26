/**
 * Prints out the connect commands to run in order to get to a given server.
 *
 * @param {import('..').NS } ns
 */

export async function main(ns) {
  ns.tprint('\n' + getPathCommands(ns, ns.args[0]));
}

export function getPathCommands(ns, server) {
  return (
    getPath(ns, server)
      .map(path => `connect ${path}`)
      .join('; ') + '; '
  );
}

/**
 * @param {import('..').NS } ns
 * @param {string} server Server to get path to.
 * @param {string} [root]
 * @param {string} [parent]
 * @returns {Set<string>}
 */
function getPath(ns, server, root, parent) {
  if (parent === undefined) parent = 'home';
  const children = ns.scan(root).filter(child => child != parent);
  if (children.includes(server)) return [server];
  for (const child of children) {
    const path = getPath(ns, server, child, root);
    if (path.length > 0) return [child, ...path];
  }
  return [];
}
