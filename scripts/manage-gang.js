import { getGangTasks } from 'database/gang-tasks';
import { HOME_HOSTNAME } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

const POTENTIAL_GANG_MEMBER_NAMES = [
  'Abyss',
  'Beast',
  'Bullet',
  'Catalyst',
  'Cipher',
  'Cobra',
  'Echo',
  'Eclipse',
  'Enigma',
  'Frost',
  'Ghost',
  'Havoc',
  'Haze',
  'Inferno',
  'Obsidian',
  'Omega',
  'Phantom',
  'Phoenix',
  'Razor',
  'Renegade',
  'Riptide',
  'Scorpion',
  'Shadow',
  'Spike',
  'Storm',
  'Tempest',
  'Thunder',
  'Venom',
  'Viper',
  'Vortex',
];

const EQUIPMENT_NAMES = [
  'Baseball Bat',
  'Katana',
  'Glock 18C',
  'P90C',
  'Steyr AUG',
  'AK-47',
  'M15A10 Assault Rifle',
  'AWM Sniper Rifle',
  'Bulletproof Vest',
  'Full Body Armor',
  'Liquid Body Armor',
  'Graphene Plating Armor',
  'Ford Flex V20',
  'ATX1070 Superbike',
  'Mercedes-Benz S9001',
  'White Ferrari',
  'NUKE Rootkit',
  'Soulstealer Rootkit',
  'Demon Rootkit',
  'Hmap Node',
  'Jack the Ripper',
  'Bionic Arms',
  'Bionic Legs',
  'Bionic Spine',
  'BrachiBlades',
  'Nanofiber Weave',
  'Synthetic Heart',
  'Synfibril Muscle',
  'BitWire',
  'Neuralstimulator',
  'DataJack',
  'Graphene Bone Lacings',
];

const WANTED_PENALTY_THRESHOLD = 0.99;

/**
 * Manages gang members.
 *
 * Use arg[0] to override amount of money to spend (e.g. run manage-gang.js 0)
 * will not spend any money on equipment.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());

  const gangTasks = getGangTasks(ns);

  // Get profitable tasks sorted from least difficult to most difficult.
  const profitableTasks = gangTasks.filter(task => task.baseMoney > 0);
  profitableTasks.sort((task1, task2) => task1.difficulty - task2.difficulty);
  const profitableTaskNames = profitableTasks.map(task => task.name);

  // Get vigilante justice task which decreases wanted level.
  const vigilanteJusticeTask = gangTasks.find(task => task.baseWanted < 0);

  const gangMembers = getGangMembers(ns);

  while (true) {
    log(ns, gangMembers);
    let gangInfo = ns.gang.getGangInformation();

    // Only engage in territory warfare if wanted penalty is below threshold and
    // territory is less than threshold and we have enough power.
    const otherGangInfo = ns.gang.getOtherGangInformation();
    let maxClashWinChance = 1;
    for (const gangName in otherGangInfo) {
      if (otherGangInfo[gangName].territory === 0) continue;
      const clashChance = ns.gang.getChanceToWinClash(gangName);
      maxClashWinChance = Math.max(maxClashWinChance, clashChance);
    }
    // ns.gang.setTerritoryWarfare(
    //   (gangInfo.territory > 0 &&
    //     gangInfo.wantedPenalty >= WANTED_PENALTY_THRESHOLD &&
    //     gangInfo.territory < 0.5 &&
    //     maxClashWinChance > 0.5) ||
    //     (gangInfo.territory < 1 && maxClashWinChance > 0.9)
    // );

    // Recruit if possible.
    const recruit = recruitGangMember(ns);
    if (recruit) gangMembers.push(recruit);

    gangInfo = ns.gang.getGangInformation();
    for (const gangMember of gangMembers) {
      // Ascend if possible.
      const potentialAscensionResult = ns.gang.getAscensionResult(
        gangMember.name
      );
      if (potentialAscensionResult) {
        // Only ascend if any stat multiplier is >= 2.
        if (
          [
            potentialAscensionResult.agi,
            potentialAscensionResult.cha,
            potentialAscensionResult.def,
            potentialAscensionResult.dex,
            potentialAscensionResult.hack,
            potentialAscensionResult.str,
          ].filter(multiplier => multiplier >= 2).length > 0
        ) {
          const ascended = ns.gang.ascendMember(gangMember.name);
          if (ascended) ns.toast(`${gangMember.name} has ascended in gang`);
        }
      }

      // Upgrade equipment.
      // if (ns.args.length === 0 || ns.args[0] !== 0) {
      //   for (const equipmentName of EQUIPMENT_NAMES) {
      //     const moneyAvailable =
      //       ns.args[0] || ns.getServerMoneyAvailable(HOME_HOSTNAME) / 4;
      //     if (ns.gang.getEquipmentCost(equipmentName) < moneyAvailable) {
      //       ns.gang.purchaseEquipment(gangMember.name, equipmentName);
      //     }
      //   }
      // }

      // if (gangInfo.territoryClashChance > 0) {
      // ns.gang.setMemberTask(gangMember.name, 'Territory Warfare');
      //   continue;
      // }

      // If wanted level is too high, then vigilante justice.
      if (
        gangInfo.wantedLevel > 1 &&
        (gangInfo.wantedPenalty < WANTED_PENALTY_THRESHOLD ||
          (gangMember.task === vigilanteJusticeTask.name &&
            gangInfo.wantedPenalty < 0))
      ) {
        ns.gang.setMemberTask(gangMember.name, vigilanteJusticeTask.name);
        continue;
      }

      // Upgrade to most profitable task.
      const taskNameToMoneyGainMap = {};
      for (const taskName of profitableTaskNames) {
        ns.gang.setMemberTask(gangMember.name, taskName);
        taskNameToMoneyGainMap[taskName] = ns.gang.getMemberInformation(
          gangMember.name
        ).moneyGain;
      }
      const mostProfitableTask = Object.entries(taskNameToMoneyGainMap).sort(
        (a, b) => b[1] - a[1]
      )[0];
      if (mostProfitableTask[1] < 1000) {
        // No profitable tasks will gain enough money, so go back to training.
        ns.gang.setMemberTask(gangMember.name, 'Train Combat');
      } else {
        ns.gang.setMemberTask(gangMember.name, mostProfitableTask[0]);
      }
    }

    // If we're not engaging in territory warfare, have the member with the
    // least profit work on Territory Warfare.
    if (gangInfo.territoryClashChance === 0) {
      let gangMemberWithLeastProfit, leastProfit;
      for (const gangMember of gangMembers) {
        const profit = ns.gang.getMemberInformation(gangMember.name).moneyGain;
        if (profit === 0) continue;
        if (!leastProfit || profit < leastProfit) {
          gangMemberWithLeastProfit = gangMember;
          leastProfit = profit;
        }
      }
      if (gangMemberWithLeastProfit) {
        ns.gang.setMemberTask(
          gangMemberWithLeastProfit.name,
          'Territory Warfare'
        );
      }
    }

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
      ns.toast(`Recruited ${potentialName} to gang`);
      return ns.gang.getMemberInformation(potentialName);
    }
    potentialNameIndex =
      (potentialNameIndex + 1) % POTENTIAL_GANG_MEMBER_NAMES.length;
  }
}
