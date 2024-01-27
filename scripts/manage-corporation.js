const CITY_NAMES = [
  'Aevum',
  'Chongqing',
  'Sector-12',
  'New Tokyo',
  'Ishima',
  'Volhaven',
];

/**
 * Manages corporation.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const divisionNameToOfficesMap = getDivisionNameToOfficesMap(ns);
    for (const divisionName in divisionNameToOfficesMap) {
      const offices = divisionNameToOfficesMap[divisionName];
      for (const office of offices) {
        if (office.avgEnergy < 100) {
          ns.corporation.buyTea(divisionName, office.city);
        }
      }
    }

    await ns.corporation.nextUpdate();
  }
}

/**
 * Note that this requires all divisions to be named "[Industry] Division"
 *
 * @param {NS} ns
 * @returns {Object.<string, import("../NetscriptDefinitions").Office[]>}
 *          map of division name to all offices in that division
 */
function getDivisionNameToOfficesMap(ns) {
  const potentialDivisionNames = ns.corporation
    .getConstants()
    .industryNames.map(industryName => `${industryName} Division`);

  const divisionNameToOfficesMap = {};
  for (const divisionName of potentialDivisionNames) {
    for (const cityName of CITY_NAMES) {
      try {
        const office = ns.corporation.getOffice(divisionName, cityName);
        (divisionNameToOfficesMap[divisionName] ??= []).push(office);
      } catch (e) {}
    }
  }

  return divisionNameToOfficesMap;
}
