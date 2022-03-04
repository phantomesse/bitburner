import { sort } from './utils/misc';

const UNLOCKS = ['Shady Accounting', 'Government Partnership'];

const UPGRADES = [
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

/**
 * @typedef {Object} Industry
 * @param {string} name
 * @param {Material[]} inputs
 * @param {Material[]} outputs
 */

/**
 * @typedef {Object} Material
 * @param {string} name
 * @param {number} quantity
 */

/** @type {Industry[]} */ const INDUSTRIES = [
  {
    name: 'Agriculture',
    inputs: [
      { name: 'Water', quantity: 0.5 },
      { name: 'Energy', quantity: 0.5 },
    ],
    outputs: [
      { name: 'Plants', quantity: 1 },
      { name: 'Food', quantity: 1 },
    ],
  },
  {
    name: 'Chemical',
    inputs: [
      { name: 'Plants', quantity: 1 },
      { name: 'Energy', quantity: 0.5 },
      { name: 'Water', quantity: 0.5 },
    ],
    outputs: [{ name: 'Chemicals', quantity: 1 }],
  },
  {
    name: 'Computer',
    inputs: [
      { name: 'Metal', quantity: 2 },
      { name: 'Energy', quantity: 1 },
    ],
    outputs: [],
  },
  {
    name: 'Energy',
    inputs: [
      { name: 'Hardware', quantity: 0.1 },
      { name: 'Metal', quantity: 0.2 },
    ],
    outputs: [{ name: 'Energy', quantity: 1 }],
  },
  {
    name: 'Fishing',
    inputs: [{ name: 'Energy', quantity: 0.5 }],
    outputs: [{ name: 'Food', quantity: 1 }],
  },
  {
    name: 'Food',
    inputs: [
      { name: 'Food', quantity: 0.5 },
      { name: 'Water', quantity: 0.5 },
      { name: 'Energy', quantity: 0.2 },
    ],
    outputs: [{ name: 'Food', quantity: 1 }],
  },
  {
    name: 'Healthcare',
    inputs: [
      { name: 'Robots', quantity: 10 },
      { name: 'AICores', quantity: 5 },
      { name: 'Energy', quantity: 5 },
      { name: 'Water', quantity: 5 },
    ],
    outputs: [],
  },
  {
    name: 'Mining',
    inputs: [{ name: 'Energy', quantity: 0.8 }],
    outputs: [{ name: 'Metal', quantity: 1 }],
  },
  {
    name: 'Pharmaceutical',
    inputs: [
      { name: 'Chemicals', quantity: 2 },
      { name: 'Energy', quantity: 1 },
      { name: 'Water', quantity: 0.5 },
    ],
    outputs: [{ name: 'Drugs', quantity: 1 }],
  },
  {
    name: 'RealEstate',
    inputs: [
      { name: 'Metal', quantity: 5 },
      { name: 'Energy', quantity: 5 },
      { name: 'Water', quantity: 2 },
      { name: 'Hardware', quantity: 4 },
    ],
    outputs: [{ name: 'Real Estate', quantity: 1 }],
  },
  {
    name: 'Robotics',
    inputs: [
      { name: 'Hardware', quantity: 5 },
      { name: 'Energy', quantity: 3 },
    ],
    outputs: [{ name: 'Robots', quantity: 1 }],
  },
  {
    name: 'Software',
    inputs: [
      { name: 'Hardware', quantity: 0.5 },
      { name: 'Energy', quantity: 0.5 },
    ],
    outputs: [{ name: 'AI Cores', quantity: 1 }],
  },
  {
    name: 'Tobacco',
    inputs: [
      { name: 'Plants', quantity: 1 },
      { name: 'Water', quantity: 0.2 },
    ],
    outputs: [],
  },
  {
    name: 'Utilities',
    inputs: [
      { name: 'Hardware', quantity: 0.1 },
      { name: 'Metal', quantity: 0.1 },
    ],
    outputs: [{ name: 'Water', quantity: 1 }],
  },
];

const CITY_NAMES = [
  'Aevum',
  'Chongqing',
  'Sector-12',
  'New Tokyo',
  'Ishima',
  'Volhaven',
];

const RESEARCH_NAMES = [
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
    for (const unlock of UNLOCKS) {
      if (
        ns.corporation.getUnlockUpgradeCost(unlock) <=
        ns.corporation.getCorporation().funds
      ) {
        ns.corporation.unlockUpgrade(unlock);
        ns.print('unlocked ' + unlock);
      }
    }
    for (const upgrade of UPGRADES) {
      while (
        ns.corporation.getUpgradeLevelCost(upgrade) <=
        ns.corporation.getCorporation().funds
      ) {
        ns.corporation.levelUpgrade(upgrade);
        ns.print('upgraded ' + upgrade);
      }
    }
    for (const industry of INDUSTRIES) {
      const divisionName = industry.name + ' Division';
      try {
        if (
          ns.corporation
            .getCorporation()
            .divisions.filter(division => division.name === divisionName)
            .length === 0
        ) {
          ns.corporation.expandIndustry(industry.name, divisionName);
          ns.print('expanded to ' + divisionName);
        }
      } catch (e) {}

      for (const cityName of CITY_NAMES) {
        try {
          if (
            ns.corporation
              .getCorporation()
              .divisions.filter(division => division.name === divisionName)
              .length > 0 &&
            !ns.corporation.getDivision(divisionName).cities.includes(cityName)
          ) {
            ns.corporation.expandCity(divisionName, cityName);
            ns.print(`expanded to ${cityName} in ${divisionName}`);
          }
        } catch (e) {}
      }
    }

    // Division-specific actions.
    const divisions = ns.corporation.getCorporation().divisions;
    for (const division of divisions) {
      for (const cityName of division.cities) {
        manageWarehouse(ns, division.name, cityName);
        manageResearch(ns, division.name);

        while (
          ns.corporation.getHireAdVertCost(division.name) <
          ns.corporation.getCorporation().funds
        ) {
          ns.corporation.hireAdVert(division.name);
          ns.print('hired advert in ' + division.name);
        }

        if (ns.corporation.hasWarehouse(division.name, cityName)) {
          const industry = INDUSTRIES.filter(
            industry => industry.name === division.type
          )[0];

          for (const material of industry.outputs) {
            // Export any output materials that are also input materials for other
            // divisions.
            const targets = [];
            const exportIndustries = INDUSTRIES.filter(
              i =>
                ['Real Estate', 'Hardware', 'Robots', 'AI Cores'].includes(
                  material.name
                ) ||
                i.inputs.filter(mat => mat.name === material.name).length > 0
            ).filter(
              i =>
                ns.corporation
                  .getCorporation()
                  .divisions.filter(d => d.name.includes(i.name)).length > 0
            );
            for (const exportIndustry of exportIndustries) {
              const targetDivisionName = exportIndustry.name + ' Division';
              for (const targetCityName of ns.corporation.getDivision(
                targetDivisionName
              ).cities) {
                targets.push({
                  division: targetDivisionName,
                  city: targetCityName,
                });
              }
            }
            for (const target of targets) {
              ns.corporation.exportMaterial(
                division.name,
                cityName,
                target.division,
                target.city,
                material.name,
                `MAX / ${targets.length + 1}`
              );
            }

            ns.corporation.sellMaterial(
              division.name,
              cityName,
              material.name,
              targets.length === 0 ? 'MAX' : 'MAX / ' + (targets.length + 1),
              'MP'
            );

            // Use Market TA for all output materials.
            ns.corporation.setMaterialMarketTA1(
              division.name,
              cityName,
              material.name,
              true
            );
            ns.corporation.setMaterialMarketTA2(
              division.name,
              cityName,
              material.name,
              true
            );
          }
        }

        // Use Market TA for all products.
        const funds = ns.corporation.getCorporation().funds;
        ns.corporation.makeProduct(
          division.name,
          cityName,
          'Product ' +
            ns.corporation.getDivision(division.name).products.length,
          funds / 2,
          funds / 2
        );
        for (const product of division.products) {
          ns.corporation.sellProduct(
            division.name,
            cityName,
            product,
            'MAX',
            'MP',
            true
          );
          ns.corporation.setProductMarketTA1(division.name, product, true);
          ns.corporation.setProductMarketTA2(division.name, product, true);
        }
      }
    }

    for (const division of divisions) {
      for (const cityName of division.cities) {
        await manageEmployees(ns, division, cityName);
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
  for (const researchName of RESEARCH_NAMES) {
    try {
      ns.corporation.research(divisionName, researchName);
      ns.print('researched ' + researchName + ' in ' + divisionName);
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
      await ns.corporation.assignJob(
        divisionName,
        cityName,
        employee.name,
        job
      );
      ns.print(
        `assigned ${employee.name} in ${divisionName} - ${cityName} to ${job}`
      );
    }
  }

  const hasResearchLeft = RESEARCH_NAMES.find(researchName => {
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
    divisor * 2,
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
