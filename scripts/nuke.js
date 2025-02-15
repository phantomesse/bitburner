/**
 * Attemps to run scripts and nuke a server.
 *
 * Run: `run nuke.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const serverName = ns.args[0];
  runProgram(() => ns.brutessh(serverName));
  runProgram(() => ns.ftpcrack(serverName));
  runProgram(() => ns.relaysmtp(serverName));
  runProgram(() => ns.httpworm(serverName));
  runProgram(() => ns.sqlinject(serverName));
  runProgram(() => ns.nuke(serverName));
}

/** @param {function} programFn */
function runProgram(programFn) {
  try {
    programFn();
  } catch (_) {}
}

export const autocomplete = (data) => data.servers;
