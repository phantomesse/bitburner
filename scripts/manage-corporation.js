import { printTable } from 'utils/table';

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
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());

  while (true) {
    ns.clearLog();

    const divisionNameToOfficesMap = getDivisionNameToOfficesMap(ns);
    for (const divisionName in divisionNameToOfficesMap) {
      const offices = divisionNameToOfficesMap[divisionName];
      logDivision(ns, divisionName, offices);
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

/**
 * @param {NS} ns
 * @param {string} divisionName
 * @param {import("../NetscriptDefinitions").Office[]} offices
 */
function logDivision(ns, divisionName, offices) {
  ns.print('\n' + divisionName);
  let blah = 0;
  const thing = React.createElement('div', {}, blah);
  const button = React.createElement(
    'button',
    {
      onClick: () => {
        blah++;
        thing.
      },
    },
    'click me'
  );
  ns.printRaw(button);
  ns.printRaw(thing);

  /** @type {import("utils/table").Table} */ const table = { rows: [] };
  for (const office of offices) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'City', style: {} },
          content: office.city,
        },
        {
          column: { name: 'Expenses', style: {} },
          content: ns.corporation.getDivision(divisionName).thisCycleExpenses,
        },
      ],
    };
    table.rows.push(row);
  }
  printTable(ns, table);
}
