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

const MULTIPLIER_MATERIAL_NAMES = [
  'Real Estate',
  'Hardware',
  'Robots',
  'AI Cores',
];

/**
 * @typedef {Object} Industry
 * @param {string} name
 * @param {Material[]} inputs
 * @param {Material[]} outputs
 * @param {number} maxProducts
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
    maxProducts: 0,
  },
  {
    name: 'Chemical',
    inputs: [
      { name: 'Plants', quantity: 1 },
      { name: 'Energy', quantity: 0.5 },
      { name: 'Water', quantity: 0.5 },
    ],
    outputs: [{ name: 'Chemicals', quantity: 1 }],
    maxProducts: 0,
  },
  {
    name: 'Computer',
    inputs: [
      { name: 'Metal', quantity: 2 },
      { name: 'Energy', quantity: 1 },
    ],
    outputs: [],
    maxProducts: 3,
  },
  {
    name: 'Energy',
    inputs: [
      { name: 'Hardware', quantity: 0.1 },
      { name: 'Metal', quantity: 0.2 },
    ],
    outputs: [{ name: 'Energy', quantity: 1 }],
    maxProducts: 0,
  },
  {
    name: 'Fishing',
    inputs: [{ name: 'Energy', quantity: 0.5 }],
    outputs: [{ name: 'Food', quantity: 1 }],
    maxProducts: 0,
  },
  {
    name: 'Food',
    inputs: [
      { name: 'Food', quantity: 0.5 },
      { name: 'Water', quantity: 0.5 },
      { name: 'Energy', quantity: 0.2 },
    ],
    outputs: [{ name: 'Food', quantity: 1 }],
    maxProducts: 5,
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
    maxProducts: 3,
  },
  {
    name: 'Mining',
    inputs: [{ name: 'Energy', quantity: 0.8 }],
    outputs: [{ name: 'Metal', quantity: 1 }],
    maxProducts: 0,
  },
  {
    name: 'Pharmaceutical',
    inputs: [
      { name: 'Chemicals', quantity: 2 },
      { name: 'Energy', quantity: 1 },
      { name: 'Water', quantity: 0.5 },
    ],
    outputs: [{ name: 'Drugs', quantity: 1 }],
    maxProducts: 3,
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
    maxProducts: 3,
  },
  {
    name: 'Robotics',
    inputs: [
      { name: 'Hardware', quantity: 5 },
      { name: 'Energy', quantity: 3 },
    ],
    outputs: [{ name: 'Robots', quantity: 1 }],
    maxProducts: 4,
  },
  {
    name: 'Software',
    inputs: [
      { name: 'Hardware', quantity: 0.5 },
      { name: 'Energy', quantity: 0.5 },
    ],
    outputs: [{ name: 'AI Cores', quantity: 1 }],
    maxProducts: 3,
  },
  {
    name: 'Tobacco',
    inputs: [
      { name: 'Plants', quantity: 1 },
      { name: 'Water', quantity: 0.2 },
    ],
    outputs: [],
    maxProducts: 3,
  },
  {
    name: 'Utilities',
    inputs: [
      { name: 'Hardware', quantity: 0.1 },
      { name: 'Metal', quantity: 0.1 },
    ],
    outputs: [{ name: 'Water', quantity: 1 }],
    maxProducts: 0,
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
      manageResearch(ns, division.name);

      for (const cityName of division.cities) {
        manageWarehouse(ns, division.name, cityName);

        while (
          ns.corporation.getHireAdVertCost(division.name) <
          ns.corporation.getCorporation().funds
        ) {
          ns.corporation.hireAdVert(division.name);
          ns.print('hired advert in ' + division.name);
        }
      }

      manageMaterials(ns, division.name);
      manageProducts(ns, division.name);
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
function manageMaterials(ns, divisionName) {
  const division = ns.corporation.getDivision(divisionName);
  const industry = INDUSTRIES.find(industry => industry.name === division.type);
  const cityNames = division.cities.filter(cityName =>
    ns.corporation.hasWarehouse(divisionName, cityName)
  );

  for (const cityName of cityNames) {
    // Fill half the warehouse with multiplier materials.
    const warehouse = ns.corporation.getWarehouse(divisionName, cityName);
    const multiplierMaterialQuantity =
      (warehouse.size - warehouse.sizeUsed) /
      2 /
      MULTIPLIER_MATERIAL_NAMES.length;
    for (const materialName of MULTIPLIER_MATERIAL_NAMES) {
      ns.corporation.buyMaterial(
        divisionName,
        cityName,
        materialName,
        multiplierMaterialQuantity
      );
    }

    // Sell output materials for MP and any non-output multiplier materials for
    // twice the market price.
    const outputMaterialNames = industry.outputs.map(
      (/** @type {Material} */ output) => output.name
    );
    const materialsToSell = new Set(
      MULTIPLIER_MATERIAL_NAMES.concat(outputMaterialNames)
    );
    for (const materialName of materialsToSell) {
      _sellMaterial(
        ns,
        divisionName,
        cityName,
        materialName,
        outputMaterialNames.includes(materialName) ? 'MAX' : 'MAX / 2',
        outputMaterialNames.includes(materialName) ? 'MP' : 'MP * 2'
      );
    }
  }
}

/**
 * @param {import('index').NS} ns
 * @param {string} divisionName
 */
function manageProducts(ns, divisionName) {
  // Create products if we don't have max products already.
  let division = ns.corporation.getDivision(divisionName);
  const industry = INDUSTRIES.find(industry => industry.name === division.type);
  if (division.products.length < industry.maxProducts) {
    const mostCreativeCityName = division.cities
      .map(cityName => {
        return {
          cityName: cityName,
          creativity: ns.corporation
            .getOffice(divisionName, cityName)
            .employees.map(employeeName =>
              ns.corporation.getEmployee(divisionName, cityName, employeeName)
            )
            .filter(employee => employee.pos === 'Engineer')
            .map(employee => employee.cre)
            .reduce((a, b) => a + b),
        };
      })
      .reduce((a, b) => (a.creativity > b.creativity ? a : b), {
        cityName: '',
        creativity: 0,
      }).cityName;
    if (mostCreativeCityName === '') return;
    const funds = ns.corporation.getCorporation().funds;
    ns.corporation.makeProduct(
      divisionName,
      mostCreativeCityName,
      'Product ' + division.products.length,
      funds / 2,
      funds / 2
    );
  }

  // Set Market TA.
  division = ns.corporation.getDivision(divisionName);
  for (const productName of division.products) {
    for (const cityName of division.cities) {
      if (!ns.corporation.hasWarehouse(divisionName, cityName)) continue;
      ns.corporation.sellProduct(
        divisionName,
        cityName,
        productName,
        'MAX',
        'MP',
        true
      );
    }
    try {
      ns.corporation.setProductMarketTA1(divisionName, productName, true);
      ns.corporation.setProductMarketTA2(divisionName, productName, true);
    } catch (e) {}
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
  let office = ns.corporation.getOffice(divisionName, cityName);
  let previousOfficeSize;
  do {
    office = ns.corporation.getOffice(divisionName, cityName);
    previousOfficeSize = office.size;
    ns.corporation.upgradeOfficeSize(divisionName, cityName, 1);
    if (office.size > previousOfficeSize) {
      ns.print(`expanded office size in ${divisionName} - ${cityName}`);
    }
    ns.corporation.hireEmployee(divisionName, cityName);
  } while (office.size > previousOfficeSize);

  office = ns.corporation.getOffice(divisionName, cityName);
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
    if (divisor && employees.length < divisor) return;
    if (sortFn) sort(employees, sortFn, sortReverse);
    const employeesToAssign = divisor
      ? employees.splice(0, Math.floor(employees.length / divisor))
      : employees;
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

/**
 * @param {import('index').NS} ns
 * @param {string} divisionName
 * @param {string} cityName
 * @param {string} materialName
 * @param {string} amount
 * @param {string} price
 */
function _sellMaterial(
  ns,
  divisionName,
  cityName,
  materialName,
  amount,
  price
) {
  try {
    ns.corporation.sellMaterial(
      divisionName,
      cityName,
      materialName,
      amount,
      price
    );
    ns.corporation.setMaterialMarketTA1(
      divisionName,
      cityName,
      materialName,
      true
    );
    ns.corporation.setMaterialMarketTA2(
      divisionName,
      cityName,
      materialName,
      true
    );
  } catch (e) {}
}
