import { HOME_HOSTNAME, ONE_MINUTE, ONE_SECOND } from 'utils/constants';

/**
 * @param {NS} ns
 */
export async function main(ns) {
  const companyNamesWithFactions = [
    ns.enums.CompanyName.MegaCorp,
    ns.enums.CompanyName.BachmanAndAssociates,
    ns.enums.CompanyName.BladeIndustries,
    ns.enums.CompanyName.ClarkeIncorporated,
    ns.enums.CompanyName.KuaiGongInternational,
    ns.enums.CompanyName.ECorp,
    ns.enums.CompanyName.OmniTekIncorporated,
    ns.enums.CompanyName.NWO,
    ns.enums.CompanyName.FourSigma,
    ns.enums.CompanyName.FulcrumTechnologies,
  ];

  while (true) {
    const factions = ns.getPlayer().factions;
    for (const companyName of companyNamesWithFactions) {
      const companyReputation = ns.singularity.getCompanyRep(companyName);
      if (companyReputation >= 400000 || factions.includes(companyName))
        continue;
      const field = getFieldWithHighestSalary(
        ns,
        companyName,
        companyReputation
      );
      ns.singularity.applyToCompany(companyName, field);
      ns.singularity.workForCompany(companyName, ns.singularity.isFocused());
      await ns.sleep(ONE_MINUTE);
    }
    await ns.sleep(ONE_SECOND);
  }
}

/**
 * @param {NS} ns
 * @param {string} companyName
 * @param {number} companyReputation
 * @returns {string} field with highest salary
 */
function getFieldWithHighestSalary(ns, companyName, companyReputation) {
  const currentSkills = ns.getPlayer().skills;
  const positionInfos = ns.singularity
    .getCompanyPositions(companyName)
    .map(position =>
      ns.singularity.getCompanyPositionInfo(companyName, position)
    )
    .filter(positionInfo => {
      if (positionInfo.requiredReputation > companyReputation) return false;
      const requiredSkills = positionInfo.requiredSkills;
      for (const skill in requiredSkills) {
        if (requiredSkills[skill] > currentSkills[skill]) return false;
      }
      return true;
    })
    .sort((position1, position2) => position2.salary - position1.salary);
  return positionInfos[0].field;
}
