import { GANG_TASKS, POTENTIAL_GANG_MEMBER_NAMES } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

const PROFITABLE_TASKS = [
  'Mug People',
  'Deal Drugs',
  'Strongarm Civilians',
  'Run a Con',
  'Armed Robbery',
  'Traffick Illegal Arms',
  'Threaten & Blackmail',
  'Human Trafficking',
  'Terrorism',
];

const TRAINING_TASKS = ['Train Combat', 'Train Hacking', 'Train Charisma'];

/**
 * Manages gang members.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.atExit(() => ns.closeTail());

  ns.tprint(ns.gang.getEquipmentNames());
  for (const equipment of ns.gang.getEquipmentNames()) {
    ns.tprint(`'${equipment}': {cost: ${ns.gang.getEquipmentCost(equipment)}}`);
  }

  const gangMembers = getGangMembers(ns);

  while (true) {
    log(ns, gangMembers);

    // Recruit if possible.
    recruitGangMember(ns);

    // TODO: Upgrade to profitable task from training task if ready.

    // TODO: Upgrade profitable task if possible.

    // Upgrade equipment.

    await ns.gang.nextUpdate();
  }
}

/**
 * @param {NS} ns
 * @param {GangMember[]} gangMembers
 */
function log(ns, gangMembers) {
  ns.clearLog();

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (const gangMember of gangMembers) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Name', style: {} },
          content: gangMember.name,
        },
        {
          column: { name: 'Task', style: {} },
          content: gangMember.task,
        },
        {
          column: { name: 'Hack', style: { textAlign: 'right' } },
          content: gangMember.hack,
        },
        {
          column: { name: 'Str', style: { textAlign: 'right' } },
          content: gangMember.str,
        },
        {
          column: { name: 'Def', style: { textAlign: 'right' } },
          content: gangMember.def,
        },
        {
          column: { name: 'Dex', style: { textAlign: 'right' } },
          content: gangMember.dex,
        },
        {
          column: { name: 'Agi', style: { textAlign: 'right' } },
          content: gangMember.agi,
        },
        {
          column: { name: 'Cha', style: { textAlign: 'right' } },
          content: gangMember.cha,
        },
        {
          column: { name: 'Money Gain', style: { textAlign: 'right' } },
          content: formatMoney(ns, gangMember.moneyGain),
        },
        {
          column: { name: 'Wanted Level Gain', style: { textAlign: 'right' } },
          content: ns.formatNumber(gangMember.wantedLevelGain),
        },
        {
          column: { name: 'Respect Gain', style: { textAlign: 'right' } },
          content: ns.formatNumber(gangMember.respectGain),
        },
      ],
    };
    table.rows.push(row);
  }
  printTable(ns, table);
}

/**
 * @typedef GangMember
 * @property {string} name
 * @property {string} task
 * @property {number} earnedRespect
 * @property {number} hack
 * @property {number} str
 * @property {number} def
 * @property {number} dex
 * @property {number} agi
 * @property {number} cha
 * @property {number} hack_exp
 * @property {number} str_exp
 * @property {number} def_exp
 * @property {number} dex_exp
 * @property {number} agi_exp
 * @property {number} cha_exp
 * @property {number} hack_mult
 * @property {number} str_mult
 * @property {number} def_mult
 * @property {number} dex_mult
 * @property {number} agi_mult
 * @property {number} cha_mult
 * @property {number} hack_asc_mult
 * @property {number} str_asc_mult
 * @property {number} def_asc_mult
 * @property {number} dex_asc_mult
 * @property {number} agi_asc_mult
 * @property {number} cha_asc_mult
 * @property {number} hack_asc_points
 * @property {number} str_asc_points
 * @property {number} def_asc_points
 * @property {number} dex_asc_points
 * @property {number} agi_asc_points
 * @property {number} cha_asc_points
 * @property {string[]} upgrades
 * @property {string[]} augmentations
 * @property {number} respectGain
 * @property {number} wantedLevelGain
 * @property {number} moneyGain
 *
 * @param {NS} ns
 * @returns {GangMember[]} member information for all gang members
 */
function getGangMembers(ns) {
  const gangMembers = [];
  for (const name of POTENTIAL_GANG_MEMBER_NAMES) {
    try {
      gangMembers.push(ns.gang.getMemberInformation(name));
    } catch (_) {}
  }
  return gangMembers;
}

/**
 * Recruits a gang member and give it a random unassigned name.
 *
 * @param {NS} ns
 * @param {GangMember|null} null if cannot recruit
 */
function recruitGangMember(ns) {
  if (!ns.gang.canRecruitMember()) return null;

  let potentialNameIndex = Math.floor(
    Math.random() * POTENTIAL_GANG_MEMBER_NAMES.length
  );
  while (true) {
    const potentialName = POTENTIAL_GANG_MEMBER_NAMES[potentialNameIndex];
    const wasSuccessful = ns.gang.recruitMember(potentialName);
    if (wasSuccessful) {
      return ns.gang.getMemberInformation(potentialName);
    }
    potentialNameIndex =
      (potentialNameIndex + 1) % POTENTIAL_GANG_MEMBER_NAMES.length;
  }
}
