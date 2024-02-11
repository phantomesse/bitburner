import { COMPANY_NAMES } from 'utils/constants';

/**
 * Apply to all jobs in order to get the faction rumors.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  for (const companyName of COMPANY_NAMES) {
    const positionNames = ns.singularity.getCompanyPositions(companyName);

    for (const positionName of positionNames) {
      const field = ns.singularity.getCompanyPositionInfo(
        companyName,
        positionName
      ).field;
      ns.singularity.applyToCompany(companyName, field);
    }
  }
}
