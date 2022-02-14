import { sort } from './utils/misc';

const DIVISION_NAMES = [
  'Agriculture Division',
  'Software Division',
  'Food Division',
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
    for (const divisionName of DIVISION_NAMES) {
      const division = ns.corporation.getDivision(divisionName);
      for (const cityName of division.cities) {
        await manageEmployees(ns, division, cityName);
        await manageWarehouse(ns, division, cityName);
      }
    }
    await ns.sleep(1000 * 10);
  }
}

/**
 * @param {import('index').NS} ns
 * @param {import('index').Division} division
 * @param {string} cityName
 */
async function manageEmployees(ns, division, cityName) {
  const divisionName = division.name;
  const office = ns.corporation.getOffice(divisionName, cityName);
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

  // Assign the worst traited employees to training.
  await assignJobs(
    'Training',
    6,
    (/** @type {import('index').Employee} */ employee) =>
      employee.cha + employee.exp + employee.cre + employee.eff
  );

  // Assign the most experienced employees to be managers.
  await assignJobs(
    'Management',
    5,
    (/** @type {import('index').Employee} */ employee) => employee.exp,
    true
  );

  // Assign the smartest employees to be researchers.
  await assignJobs(
    'Research & Development',
    4,
    (/** @type {import('index').Employee} */ employee) => employee.int,
    true
  );

  // Assign the most charistmatic employees to be businessmen.
  await assignJobs(
    'Business',
    3,
    (/** @type {import('index').Employee} */ employee) => employee.cha,
    true
  );

  // Assign the most creative employees to be engineers.
  await assignJobs(
    'Engineer',
    2,
    (/** @type {import('index').Employee} */ employee) => employee.cre,
    true
  );

  // Assign the rest to be operators.
  await assignJobs('Operations');
}

/**
 * @param {import('index').NS} ns
 * @param {import('index').Division} division
 * @param {string} cityName
 */
async function manageWarehouse(ns, division, cityName) {
  const warehouse = ns.corporation.getWarehouse(division.name, cityName);
  ns.print(
    `${division.name} - ${cityName}: ${warehouse.sizeUsed} / ${warehouse.size}`
  );
  if (warehouse.sizeUsed > warehouse.size * 0.9) {
    ns.print(`upgrading warehouse in ${division.name} - ${cityName}`);
    ns.corporation.upgradeWarehouse(division.name, cityName);
  }
}
