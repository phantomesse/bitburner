import { sort } from './utils/misc';

const upgrades = [
  'Smart Factories',
  'Smart Storage',
  'DreamSense',
  'Wilson Analytics',
  'Nuoptimal Nootropic Injector Implants',
  'Speech Processor Implants',
  'Neural Accelerators',
  'FocusWires',
  'ABC SalesBots',
  'Project Insight',
];

const researchNames = [
  'Hi-Tech R&D Laboratory',
  'AutoBrew',
  'AutoPartyManager',
  'Automatic Drug Administration',
  'Go-Juice',
  'CPH4 Injections',
  'Bulk Purchasing',
  'Drones',
  'Drones - Assembly',
  'Drones - Transport',
  'HRBuddy-Recruitment',
  'HRBuddy-Training',
  'JoyWire',
  'Market-TA.I',
  'Market-TA.II',
  'Overclock',
  'Sti.mu',
  'Self-Correcting Assemblers',
  'uPgrade: Fulcrum',
  'uPgrade: Capacity.I',
  'uPgrade: Capacity.II',
  'uPgrade: Dashboard',
];

/**
 * Manages a corporation.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  while (true) {
    ns.clearLog();

    // Upgrade corporation.
    for (const upgrade of upgrades) {
      try {
        ns.corporation.levelUpgrade(upgrade);
      } catch (e) {}
    }

    // Division-specific actions.
    const divisions = ns.corporation.getCorporation().divisions;
    for (const division of divisions) {
      for (const cityName of division.cities) {
        manageWarehouse(ns, division.name, cityName);
        manageResearch(ns, division.name);
        await manageEmployees(ns, division, cityName);

        // Use Market TA for all products.
        for (const product of division.products) {
          ns.corporation.setProductMarketTA1(division.name, product, true);
          ns.corporation.setProductMarketTA2(division.name, product, true);
        }
      }
    }

    await ns.sleep(1000 * 10);
  }
}

/**
 * @param {import('index').NS} ns
 * @param {string} divisionName
 */
function manageResearch(ns, divisionName) {
  for (const researchName of researchNames) {
    try {
      ns.corporation.research(divisionName, researchName);
      ns.print('reserached ' + researchName + ' in ' + divisionName);
    } catch (e) {}
  }
}

/**
 * @param {import('index').NS} ns
 * @param {string} divisionName
 * @param {string} cityName
 */
function manageWarehouse(ns, divisionName, cityName) {
  if (!ns.corporation.hasWarehouse(divisionName, cityName)) {
    if (
      ns.corporation.getPurchaseWarehouseCost() <
      ns.corporation.getCorporation().funds
    ) {
      ns.corporation.purchaseWarehouse(divisionName, cityName);
    } else {
      return;
    }
  }

  // Upgrade warehouse size if more than 90% of it is being used.
  const warehouse = ns.corporation.getWarehouse(divisionName, cityName);
  if (
    ns.corporation.getUpgradeWarehouseCost(divisionName, cityName) <
      ns.corporation.getCorporation().funds &&
    warehouse.sizeUsed > warehouse.size * 0.9
  ) {
    ns.print(`upgrading warehouse in ${divisionName} - ${cityName}`);
    ns.corporation.upgradeWarehouse(divisionName, cityName);
  }
}

/**
 * @param {import('index').NS} ns
 * @param {import('index').Division} division
 * @param {string} cityName
 */
async function manageEmployees(ns, division, cityName) {
  const divisionName = division.name;

  // Expand office and hire.
  const office = ns.corporation.getOffice(divisionName, cityName);
  let previousOfficeSize;
  do {
    previousOfficeSize = office.size;
    ns.corporation.upgradeOfficeSize(divisionName, cityName, 1);
    if (office.size > previousOfficeSize) {
      ns.print(`expanded office size in ${divisionName} - ${cityName}`);
    }
    ns.corporation.hireEmployee(divisionName, cityName);
  } while (office.size > previousOfficeSize);

  const employees = office.employees.map(employeeName =>
    ns.corporation.getEmployee(divisionName, cityName, employeeName)
  );

  /**
   * @param {string} job
   * @param {number} [divisor]
   * @param {*} [sortFn]
   * @param {boolean} [sortReverse]
   */
  async function assignJobs(job, divisor, sortFn, sortReverse) {
    if (!divisor) divisor = 1;
    if (employees.length < divisor) return;
    if (sortFn) sort(employees, sortFn, sortReverse);
    const employeesToAssign = employees.splice(
      0,
      Math.floor(employees.length / divisor)
    );
    for (const employee of employeesToAssign) {
      if (employee.pos === job) continue;
      ns.print(
        `assigning ${employee.name} in ${divisionName} - ${cityName} to ${job}`
      );
      await ns.corporation.assignJob(
        divisionName,
        cityName,
        employee.name,
        job
      );
    }
  }

  const hasResearchLeft = researchNames.find(researchName => {
    if (ns.corporation.hasResearched(divisionName, researchName)) return false;
    try {
      ns.corporation.getResearchCost(divisionName, researchName);
      return true;
    } catch (e) {
      return false;
    }
  });
  let divisor = hasResearchLeft ? 6 : 5;

  // Assign the worst traited employees to training.
  await assignJobs(
    'Training',
    divisor,
    (/** @type {import('index').Employee} */ employee) =>
      employee.cha + employee.exp + employee.cre + employee.eff
  );
  divisor--;

  // Assign the most experienced employees to be managers.
  await assignJobs(
    'Management',
    divisor,
    (/** @type {import('index').Employee} */ employee) => employee.exp,
    true
  );
  divisor--;

  // Assign the smartest employees to be researchers.
  if (hasResearchLeft) {
    await assignJobs(
      'Research & Development',
      divisor,
      (/** @type {import('index').Employee} */ employee) => employee.int,
      true
    );
    divisor--;
  }

  // Assign the most charistmatic employees to be businessmen.
  await assignJobs(
    'Business',
    divisor,
    (/** @type {import('index').Employee} */ employee) => employee.cha,
    true
  );
  divisor--;

  // Assign the most creative employees to be engineers.
  await assignJobs(
    'Engineer',
    divisor,
    (/** @type {import('index').Employee} */ employee) => employee.cre,
    true
  );

  // Assign the rest to be operators.
  await assignJobs('Operations');
}
