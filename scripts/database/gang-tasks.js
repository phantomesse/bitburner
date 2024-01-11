/** Util functions for managing gang-tasks.txt */

const GANG_TASKS = [
  'Unassigned',
  'Mug People',
  'Deal Drugs',
  'Strongarm Civilians',
  'Run a Con',
  'Armed Robbery',
  'Traffick Illegal Arms',
  'Threaten & Blackmail',
  'Human Trafficking',
  'Terrorism',
  'Vigilante Justice',
  'Train Combat',
  'Train Hacking',
  'Train Charisma',
  'Territory Warfare',
];

const GANG_TASKS_FILENAME = 'database/gang-tasks.txt';

/**
 * @param {NS} ns
 */
export function writeGangTasks(ns) {
  const gangTasks = GANG_TASKS.map(task => ns.gang.getTaskStats(task));
  ns.write(GANG_TASKS_FILENAME, JSON.stringify(gangTasks), 'w');
}

/**
 * @param {NS} ns
 * @returns {import("../../NetscriptDefinitions").GangTaskStats[]}
 */
export function getGangTasks(ns) {
  return JSON.parse(ns.read(GANG_TASKS_FILENAME) || '[]');
}
