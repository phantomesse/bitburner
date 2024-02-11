import { COMPANY_NAMES } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { tprintTable } from 'utils/table';

/**
 * Prints out company position stats to the terminal.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const skills = ns.getPlayer().skills;

  /** @type {CompanyPosition} */ const eligiblePositions = [];
  for (const companyName of COMPANY_NAMES) {
    const reputation = ns.singularity.getCompanyRep(companyName);
    const positionNames = ns.singularity.getCompanyPositions(companyName);
    for (const positionName of positionNames) {
      // Only include the positions that we are eligible for.
      const positionInfo = ns.singularity.getCompanyPositionInfo(
        companyName,
        positionName
      );
      if (positionInfo.requiredReputation > reputation) continue;
      let hasRequiredSkills = true;
      for (const skillName in positionInfo.requiredSkills) {
        ns.tprint(positionInfo.requiredSkills[skillName]);
        if (positionInfo.requiredSkills[skillName] > skills[skillName]) {
          hasRequiredSkills = false;
          break;
        }
      }
      if (!hasRequiredSkills) continue;
      eligiblePositions.push(new CompanyPosition(companyName, positionInfo));
    }
  }

  eligiblePositions.sort(
    (position1, position2) =>
      position2.positionInfo.salary - position1.positionInfo.salary
  );

  /** @type {import("utils/table").Table} */ const table = { rows: [] };
  for (const position of eligiblePositions) {
    /** @type {import("utils/table").Row} */ const row = {
      cells: [
        {
          column: { name: 'Company', style: {} },
          content: position.companyName,
        },
        {
          column: { name: 'Position', style: {} },
          content: position.positionInfo.name,
        },
        {
          column: { name: 'Field', style: {} },
          content: position.positionInfo.field,
        },
        {
          column: { name: 'Salary / s', style: {} },
          content: formatMoney(ns, position.positionInfo.salary),
        },
        {
          column: { name: 'Required Rep', style: {} },
          content: ns.formatNumber(position.positionInfo.requiredReputation),
        },
      ],
    };
    table.rows.push(row);
  }
  tprintTable(ns, table);
}

class CompanyPosition {
  /**
   * @param {string} companyName
   * @param {import('../NetscriptDefinitions').CompanyPositionInfo} positionInfo
   */
  constructor(companyName, positionInfo) {
    this.companyName = companyName;
    this.positionInfo = positionInfo;
  }
}
