import { formatMoney } from 'utils/format';
import { Cell, LEFT_ALIGN_STYLES, printTable, Table } from 'utils/table';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  while (true) {
    ns.clearLog();

    const gangMemberNames = ns.gang.getMemberNames();

    const table = new Table();
    for (const gangMemberName of gangMemberNames) {
      const gangMemberInfo = ns.gang.getMemberInformation(gangMemberName);

      table.cells.push({
        columnName: 'Name',
        rowId: gangMemberName,
        content: gangMemberName,
        value: gangMemberName,
        columnStyles: LEFT_ALIGN_STYLES,
      });

      table.cells.push({
        columnName: 'Task',
        rowId: gangMemberName,
        content: gangMemberInfo.task,
        value: gangMemberInfo.task,
        columnStyles: LEFT_ALIGN_STYLES,
      });

      const moneyGain = gangMemberInfo.moneyGain;
      table.cells.push({
        columnName: '💸 Gain',
        rowId: gangMemberName,
        content: moneyGain === 0 ? '' : formatMoney(ns, moneyGain),
        value: moneyGain,
      });

      table.cells.push(getSkillCell(ns, 'hack', gangMemberInfo));
      table.cells.push(getSkillCell(ns, 'str', gangMemberInfo));
      table.cells.push(getSkillCell(ns, 'def', gangMemberInfo));
      table.cells.push(getSkillCell(ns, 'dex', gangMemberInfo));
      table.cells.push(getSkillCell(ns, 'agi', gangMemberInfo));
      table.cells.push(getSkillCell(ns, 'cha', gangMemberInfo));
    }
    printTable(ns, table);

    await ns.sleep(1000);
  }
}

/**
 * @param {NS} ns
 * @param {string} skillName
 * @param {import('../NetscriptDefinitions').GangMemberInfo} gangMemberInfo
 * @returns {Cell}
 */
function getSkillCell(ns, skillName, gangMemberInfo) {
  const skillValue = gangMemberInfo[skillName];
  return {
    columnName: skillName,
    rowId: gangMemberInfo.name,
    content: skillValue === 0 ? '' : ns.formatNumber(skillValue, 0),
    value: skillValue,
  };
}
