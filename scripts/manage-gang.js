import { GangEquipmentData, getGangData } from 'data/gang';
import { GANG_MEMBER_NAMES, GangTaskName } from 'utils/gang';
import { getMoneyAvailableToSpend } from 'utils/money';

/**
 * @typedef {Object<string, number>} TaskNameToMoneyGainMap
 */

/** @param {NS} ns */
export async function main(ns) {
  const gangData = getGangData(ns);

  // Get equipment based on whether the gang is a hacking gang or a combat gang.
  const equipmentDataList = gangData.equipmentDataList.filter(
    (equipmentData) => {
      // Always add equipment that increases charisma.
      if (equipmentData.stats.cha) return true;

      // Hacking gangs should only buy equipment that helps with hacking.
      if (gangData.isHacking) return equipmentData.stats.hack !== undefined;

      // Combat gangs should only buy equipment that helps with combat skills.
      return (
        equipmentData.stats.agi !== undefined ||
        equipmentData.stats.def !== undefined ||
        equipmentData.stats.dex !== undefined ||
        equipmentData.stats.str !== undefined
      );
    }
  );

  // Get money making task list based on whether the gang is a hacking gang or a
  // combat gang.
  const moneyMakingTaskStatsList = gangData.taskStatsList
    .filter((taskStats) => {
      if (taskStats.baseMoney === 0) return false;
      if (gangData.isHacking && !taskStats.isHacking) return false;
      if (!gangData.isHacking && !taskStats.isCombat) return false;
      return true;
    })
    .sort(
      (taskStats1, taskStats2) => taskStats2.difficulty - taskStats1.difficulty
    );

  /** @type {Object<string, TaskNameToMoneyGainMap>} */
  const gangMemberNameToTaskMoneyGainMap = {};
  function resetTaskNameToMoneyGainMap(gangMemberName) {
    gangMemberNameToTaskMoneyGainMap[gangMemberName] = Object.fromEntries(
      moneyMakingTaskStatsList.map((taskStats) => [taskStats.name, -1])
    );
  }

  while (true) {
    // Attempt to recruit a new gang member.
    const newGangMemberName = getNewGangMemberName(ns);
    if (ns.gang.recruitMember(newGangMemberName)) train(ns, newGangMemberName);

    // Manage gang members.
    const gangMemberNames = ns.gang.getMemberNames();
    for (const gangMemberName of gangMemberNames) {
      if (ascend(ns, gangMemberName)) {
        resetTaskNameToMoneyGainMap(gangMemberName);
      }

      if (buyEquipment(ns, gangMemberName, equipmentDataList)) {
        resetTaskNameToMoneyGainMap(gangMemberName);
      }

      if (!(gangMemberName in gangMemberNameToTaskMoneyGainMap)) {
        resetTaskNameToMoneyGainMap(gangMemberName);
      }
      const taskNameToMoneyGainMap =
        gangMemberNameToTaskMoneyGainMap[gangMemberName];
      assignTask(ns, gangMemberName, taskNameToMoneyGainMap);
    }

    await ns.gang.nextUpdate();
  }
}

/**
 * @param {NS} ns
 * @param {string} gangMemberName
 * @param {GangEquipmentData[]} equipmentDataList
 * @returns {boolean} whether an equipment was purchased
 */
function buyEquipment(ns, gangMemberName, equipmentDataList) {
  let purchasedEquipment = false;
  for (const equipmentData of equipmentDataList) {
    if (equipmentData.cost <= getMoneyAvailableToSpend(ns)) {
      if (ns.gang.purchaseEquipment(gangMemberName, equipmentData.name)) {
        purchasedEquipment = true;
      }
    }
  }
  return purchasedEquipment;
}

/**
 * @param {NS} ns
 * @param {string} gangMemberName
 * @param {TaskNameToMoneyGainMap} taskNameToMoneyGainMap
 */
function assignTask(ns, gangMemberName, taskNameToMoneyGainMap) {
  const gangInfo = ns.gang.getGangInformation();
  const gangMemberInfo = ns.gang.getMemberInformation(gangMemberName);

  // Prioritize reducing want penalty.
  if (gangInfo.wantedPenalty > 0 && gangInfo.wantedLevel > 1) {
    ns.gang.setMemberTask(gangMemberName, GangTaskName.VIGILANTE_JUSTICE);
    return;
  }

  // Try each money making task so we get information about how much money gain
  // we can get per task.
  if (gangMemberInfo.task in taskNameToMoneyGainMap) {
    taskNameToMoneyGainMap[gangMemberInfo.task] = gangMemberInfo.moneyGain;
  }
  if (Object.values(taskNameToMoneyGainMap).includes(-1)) {
    const taskName = Object.entries(taskNameToMoneyGainMap)
      .filter(([_, moneyGain]) => moneyGain === -1)
      .map(([taskName, _]) => taskName)[0];
    ns.gang.setMemberTask(gangMemberName, taskName);
    return;
  }

  // Assign the task with the most money gain or train the member if none of the
  // money making tasks will make any money.
  const nonZeroTaskNameToMoneyGainMap = Object.entries(
    taskNameToMoneyGainMap
  ).filter(([_, moneyGain]) => moneyGain > 0);
  if (nonZeroTaskNameToMoneyGainMap.length > 0) {
    const taskName = nonZeroTaskNameToMoneyGainMap
      .sort((entry1, entry2) => entry2[1] - entry1[1])
      .map(([taskName, _]) => taskName)[0];
    ns.gang.setMemberTask(gangMemberName, taskName);
  } else {
    train(ns, gangMemberName);
  }
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
 * @returns {boolean} whether the gang member was ascened
 */
function ascend(ns, gangMemberName) {
  const gangInfo = ns.gang.getGangInformation();

  const ascensionResult = ns.gang.getAscensionResult(gangMemberName);
  if (ascensionResult === undefined) return false;

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

  if (ns.gang.ascendMember(gangMemberName)) {
    train(ns, gangMemberName);
    return true;
  }
  return false;
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
