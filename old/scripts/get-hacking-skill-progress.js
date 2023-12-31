import { formatNumber, formatTime } from '/utils/format.js';

const HISTORY_LENGTH = 100;
const HISTORY_SECONDS = 10;

/**
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const targetLevel = ns.args[0];
  if (typeof targetLevel !== 'number') {
    ns.tprint(`usage: run get-hacking-skill-progress.js <target level>`);
    return;
  }
  if (!ns.fileExists('Formulas.exe')) {
    ns.tprint('Need Formulas.exe');
    return;
  }
  const player = ns.getPlayer();
  const targetExp = ns.formulas.skills.calculateExp(9000, player.hacking_mult);

  // Get current rate of exp growth.
  const expHistory = [];
  for (let i = 0; i < HISTORY_LENGTH; i++) {
    expHistory.push(getCurrentExp(ns));
    await ns.sleep((HISTORY_SECONDS * 1000) / HISTORY_LENGTH);
  }
  const expDiffs = [];
  for (let i = 1; i < expHistory.length; i++) {
    expDiffs.push(expHistory[i] - expHistory[i - 1]);
  }
  const averageGrowth = expDiffs.reduce((a, b) => a + b) / HISTORY_LENGTH;
  const averageGrowthPerMs =
    averageGrowth / ((HISTORY_SECONDS * 1000) / HISTORY_LENGTH);
  const currentExp = getCurrentExp(ns);
  const timeLeftMs = (targetExp - currentExp) / averageGrowthPerMs;

  ns.tprintf('Current hacking experience: ' + formatNumber(currentExp, true));
  ns.tprintf('Target hacking experience: ' + formatNumber(targetExp, true));
  ns.tprintf(
    'Average exp growth per second: ' +
      formatNumber(averageGrowthPerMs * 1000, true)
  );
  ns.tprintf('Time to reach target: ' + formatTime(timeLeftMs));
}

/** @param {import('index').NS} ns */
function getCurrentExp(ns) {
  const player = ns.getPlayer();
  return ns.formulas.skills.calculateExp(player.hacking, player.hacking_mult);
}
