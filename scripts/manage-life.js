import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';

const PROGRAM_NAMES = [
  'BruteSSH.exe',
  'FTPCrack.exe',
  'relaySMTP.exe',
  'HTTPWorm.exe',
  'SQLInject.exe',
];

/**
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Buy programs from the dark web.
    const hasTor = ns.singularity.purchaseTor();
    if (hasTor) {
      for (const programName of PROGRAM_NAMES) {
        const purchaseSuccessful = ns.singularity.purchaseProgram(programName);
        if (
          purchaseSuccessful &&
          ns.scriptRunning('gain-access.js', HOME_HOSTNAME)
        ) {
          ns.exec('gain-access.js', HOME_HOSTNAME);
        }
      }
    }

    // Upgrade home server.
    ns.singularity.upgradeHomeRam();
    ns.singularity.upgradeHomeCores();

    // const crimeType = getMostProfitableCrimeType(ns);
    // const companyPosition = getMostProfitableCompanyPosition(ns);
    await ns.sleep(ONE_SECOND);
  }
}

/**
 * @param {NS} ns
 * @returns {string} most profitable crime type
 */
function getMostProfitableCrimeType(ns) {
  function getProfitability(crimeType) {
    const crimeStats = ns.singularity.getCrimeStats(crimeType);
    return (
      (crimeStats.money / crimeStats.time) *
      ns.singularity.getCrimeChance(crimeType)
    );
  }
  return CRIME_TYPES.sort(
    (crimeStats1, crimeStats2) =>
      getProfitability(crimeStats2) - getProfitability(crimeStats1)
  )[0];
}

/**
 * @typedef CompanyPosition
 * @property {string} companyName
 * @property {string} jobTitle
 *
 * @param {NS} ns
 * @returns {CompanyPosition}
 */
function getMostProfitableCompanyPosition(ns) {
  const eligiblePositions = [];

  const skills = ns.getPlayer().skills;
  for (const companyName of COMPANY_NAMES) {
    const reputation = ns.singularity.getCompanyRep(companyName);
    const jobNames = ns.singularity.getCompanyPositions(companyName);
    for (const jobName of jobNames) {
      const positionInfo = ns.singularity.getCompanyPositionInfo(
        companyName,
        jobName
      );
      if (positionInfo.requiredReputation > reputation) continue;
      const requiredSkills = positionInfo.requiredSkills;
      let hasRequiredSkills = true;
      for (const skillName in requiredSkills) {
        if (requiredSkills[skillName] > skills[skillName]) {
          hasRequiredSkills = false;
          break;
        }
      }
      if (!hasRequiredSkills) continue;
      eligiblePositions.push({ companyName, positionInfo });
    }
  }

  eligiblePositions.sort(
    (position1, position2) =>
      position2.positionInfo.salary - position1.positionInfo.salary
  );
  return {
    companyName: eligiblePositions[0].companyName,
    jobTitle: eligiblePositions[0].positionInfo.name,
  };
}
