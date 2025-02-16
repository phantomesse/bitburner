/** @param {NS} ns */
export async function main(ns) {
  runScript(ns, 'manage/hacknet.js');
  runScript(ns, 'manage/purchase-servers.js');
  runScript(ns, 'manage/upgrade-servers.js');
  runScript(ns, 'manage/hacking.js');
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 */
function runScript(ns, scriptName) {
  if (!ns.isRunning(scriptName)) ns.run(scriptName);
}
