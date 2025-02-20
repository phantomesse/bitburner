import { GangEquipmentData, getGangData } from 'data/gang';
import { GANG_MEMBER_NAMES, GangTaskName } from 'utils/gang';
import { getMoneyAvailableToSpend } from 'utils/money';

/** @param {NS} ns */
export async function main(ns) {
  const gangData = getGangData(ns);
  const gangInfo = ns.gang.getGangInformation();

  while (true) {
    // Attempt to recruit a new gang member.
    const newGangMemberName = getNewGangMemberName(ns);
    if (ns.gang.recruitMember(newGangMemberName)) train(ns, newGangMemberName);

    // Manage gang members.
    const gangMemberNames = ns.gang.getMemberNames();
    for (const gangMemberName of gangMemberNames) {
      ascend(ns, gangMemberName);
      buyEquipment(ns, gangMemberName, gangData.equipmentDataList);
      // assignTask(ns, gangMemberName, gangData.taskStatsList);
    }

    await ns.gang.nextUpdate();
  }
}

/**
 * @param {NS} ns
 * @param {string} gangMemberName
 * @param {GangEquipmentData[]} equipmentDataList
 */
function buyEquipment(ns, gangMemberName, equipmentDataList) {
  for (const equipmentData of equipmentDataList) {
    if (equipmentData.cost <= getMoneyAvailableToSpend(ns)) {
      ns.gang.purchaseEquipment(gangMemberName, equipmentData.name);
    }
  }
}

/**
 * @param {NS} ns
 * @param {string} gangMemberName
 * @param {import('NetscriptDefinitions').GangTaskStats[]} taskStatsList
 */
function assignTask(ns, gangMemberName, taskStatsList) {
  const gangInfo = ns.gang.getGangInformation();
  const gangMemberInfo = ns.gang.getMemberInformation(gangMemberName);

  if (gangMemberInfo.task === 'Unassigned') {
    ns.gang.setMemberTask(gangMemberName, 'Train Combat');
    return;
  }

  if (gangInfo.wantedPenalty > 0 && gangInfo.wantedLevel > 1) {
    ns.gang.setMemberTask(gangMemberName, GangTaskName.VIGILANTE_JUSTICE);
    return;
  }

  let moneyMakingTaskStatsList = taskStatsList
    .filter((taskStat) =>
      gangInfo.isHacking ? taskStat.isHacking : taskStat.isCombat
    )
    .filter(
      (taskStat) =>
        ![
          GangTaskName.UNASSIGNED,
          GangTaskName.TRAIN_CHARISMA,
          GangTaskName.TRAIN_COMBAT,
          GangTaskName.TRAIN_HACKING,
          GangTaskName.TERRITORY_WARFARE,
          GangTaskName.TERRORISM,
          GangTaskName.VIGILANTE_JUSTICE,
        ].includes(taskStat.name)
    )
    .sort(
      (taskStat1, taskStat2) => taskStat1.difficulty - taskStat2.difficulty
    );
  const moneyMakingTaskNames = moneyMakingTaskStatsList.map(
    (taskStat) => taskStat.name
  );

  let newTaskName = gangInfo.isHacking
    ? GangTaskName.TRAIN_HACKING
    : GangTaskName.TRAIN_COMBAT;
  const currentTaskIndex = moneyMakingTaskNames.indexOf(gangMemberInfo.task);
  if (gangMemberInfo.moneyGain === 0) {
    if (currentTaskIndex > 0) {
      newTaskName = moneyMakingTaskNames[currentTaskIndex - 1];
    }
  } else {
    if (currentTaskIndex === moneyMakingTaskNames.length - 1) return;
    newTaskName = moneyMakingTaskNames[currentTaskIndex + 1];
  }
  ns.gang.setMemberTask(gangMemberName, newTaskName);
}

/**
 * @param {NS} ns
 * @param {string} gangMemberName
 */
function train(ns, gangMemberName) {
  const gangInfo = ns.gang.getGangInformation();
  ns.gang.setMemberTask(
    gangMemberName,
    gangInfo.isHacking ? GangTaskName.TRAIN_HACKING : GangTaskName.TRAIN_COMBAT
  );
}

/**
 * Ascend if possible or necessary.
 *
 * @param {NS} ns
 * @param {string} gangMemberName
 */
function ascend(ns, gangMemberName) {
  const gangInfo = ns.gang.getGangInformation();

  const ascensionResult = ns.gang.getAscensionResult(gangMemberName);
  if (ascensionResult === undefined) return;

  const minMultiplier = [
    gangInfo.isHacking
      ? [ascensionResult.hack, ascensionResult.cha]
      : [
          ascensionResult.agi,
          ascensionResult.def,
          ascensionResult.dex,
          ascensionResult.str,
          ascensionResult.cha,
        ],
  ];
  if (minMultiplier < 10) return;

  if (ns.gang.ascendMember(gangMemberName)) train(ns, gangMemberName);
}

/** @param {NS} ns  */
function getNewGangMemberName(ns) {
  const existingGangMemberNames = ns.gang.getMemberNames();
  const potentialGangMemberNames = GANG_MEMBER_NAMES.filter(
    (name) => !existingGangMemberNames.includes(name)
  );
  return potentialGangMemberNames[
    Math.floor(Math.random() * potentialGangMemberNames.length)
  ];
}
