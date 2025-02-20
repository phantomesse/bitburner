export const GANG_DATA_FILE_NAME = 'data/gang.json';

export class GangData {
  /** @type {import("../../NetscriptDefinitions").GangTaskStats[]} */ taskStatsList;
  /** @type {GangEquipmentData[]} */ equipmentDataList;
}

export class GangEquipmentData {
  /** @type {string} */ name;
  /** @type {string} */ type;
  /** @type {number} */ cost;
  /** @type {import("../../NetscriptDefinitions").EquipmentStats} */ stats;
}

/**
 * @param {NS} ns
 * @returns {GangData}
 */
export function getGangData(ns) {
  return JSON.parse(ns.read(GANG_DATA_FILE_NAME));
}
