import { Charter, getCharters } from 'corporation/charter';
import { PRODUCTION_MATERIAL_NAMES } from 'corporation/charter-material';
import { ONE_MINUTE, ONE_SECOND } from 'utils/constants';
import { formatMoney } from 'utils/format';

const CITIES = [
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
    const charters = getCharters(ns);

    manageUpgrades(ns);
    expandIndustries(ns);
    expandOffices(ns);

    manageResearch(ns, charters);
    manageWarehouses(ns, charters);
    manageEmployees(ns, charters);
    hireAdverts(ns, charters);

    // manageProductionMaterials(ns, [...charters]);
    manageMaterials(ns, charters);

    await ns.corporation.nextUpdate();
  }
}

/**  @param {NS} ns */
function manageUpgrades(ns) {
  const upgradeNames = ns.corporation.getConstants().upgradeNames;
  for (const upgradeName of upgradeNames) {
    try {
      ns.corporation.levelUpgrade(upgradeName);
    } catch (_) {}
  }
}

/** @param {NS} ns */
function expandIndustries(ns) {
  const industryNames = ns.corporation.getConstants().industryNames;
  const divisionNames = ns.corporation.getCorporation().divisions;
  for (const industryName of industryNames) {
    const divisionName = `${industryName} Division`;
    if (divisionNames.includes(divisionName)) continue;
    try {
      ns.corporation.expandIndustry(industryName, divisionName);
    } catch (_) {}
  }
}

/** @param {NS} ns */
function expandOffices(ns) {
  const divisionNames = ns.corporation.getCorporation().divisions;
  for (const divisionName of divisionNames) {
    for (const city of CITIES) {
      try {
        ns.corporation.expandCity(divisionName, city);
      } catch (_) {}
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function hireAdverts(ns, charters) {
  for (const charter of charters) {
    if (!charter.hasWarehouse) continue;
    ns.corporation.hireAdVert(charter.division.name);
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageResearch(ns, charters) {
  for (const charter of charters) {
    if (charter.lockedResearchNames.length === 0) continue;

    for (const researchName of charter.lockedResearchNames) {
      try {
        ns.corporation.research(charter.divisionName, researchName);
        ns.toast(`Researched ${researchName} in ${charter}`);
      } catch (_) {}
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageWarehouses(ns, charters) {
  for (const charter of charters) {
    const divisionName = charter.divisionName;
    const city = charter.city;
    if (charter.warehouse) {
      if (charter.warehouse.sizeUsed < charter.warehouse.size * 0.99) continue;
      const upgradeCost = ns.corporation.getUpgradeWarehouseCost(
        divisionName,
        city
      );
      ns.corporation.upgradeWarehouse(divisionName, city);
      const newWarehouse = ns.corporation.getWarehouse(divisionName, city);
      if (newWarehouse.size > charter.warehouse.size) {
        ns.toast(
          `Upgraded warehouse from ${ns.formatNumber(
            charter.warehouse.size
          )} to ${ns.formatNumber(newWarehouse.size)} for ${formatMoney(
            ns,
            upgradeCost
          )} in ${charter}`,
          'success',
          ONE_SECOND * 10
        );
      }
    } else {
      ns.corporation.purchaseWarehouse(divisionName, city);
      if (ns.corporation.hasWarehouse(divisionName, city)) {
        ns.toast(
          `Purchased warehouse in ${charter}`,
          'success',
          ONE_SECOND * 10
        );
      }
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageEmployees(ns, charters) {
  for (const charter of charters) {
    const divisionName = charter.divisionName;
    const city = charter.city;

    // Try to upgrade office size.
    ns.corporation.upgradeOfficeSize(divisionName, city, 1);

    // Try to hire a new employee.
    ns.corporation.hireEmployee(divisionName, city);

    // Get necessary job titles sorted from least production to most production.
    const necessaryJobTitles = [
      ...new Set([
        ...(charter.hasWarehouse
          ? ['Operations', 'Engineer', 'Business', 'Management']
          : ['Research & Development']),
        ...(charter.needsResearchers ? ['Research & Development'] : []),
      ]),
    ];
    const employeeProductionByJob = charter.office.employeeProductionByJob;
    necessaryJobTitles.sort(
      (jobTitle1, jobTitle2) =>
        employeeProductionByJob[jobTitle1] - employeeProductionByJob[jobTitle2]
    );

    // Remove all employees in unnecessary jobs.
    const employeeJobs = { ...charter.office.employeeJobs };
    for (const jobTitle in employeeJobs) {
      if (necessaryJobTitles.includes(jobTitle)) continue;
      if (jobTitle === 'Intern' && charter.needsInterns) continue;
      if (jobTitle === 'Unassigned') continue;
      employeeJobs[jobTitle] = 0;
    }

    // Assign all unassigned employees.
    const jobTitleWithLeastProduction = necessaryJobTitles[0];
    employeeJobs[jobTitleWithLeastProduction] += employeeJobs.Unassigned;
    employeeJobs.Unassigned = 0;

    // Move an employee from the most production job to the least production
    // job.
    const jobTitleWithMostProduction = necessaryJobTitles.slice(-1)[0];
    if (employeeJobs[jobTitleWithMostProduction] > 0) {
      employeeJobs[jobTitleWithMostProduction]--;
      employeeJobs[jobTitleWithLeastProduction]++;
    }

    // Move interns around so we don't have too many interns, but enough interns
    // to max out energy and morale.
    if (charter.needsInterns) {
      if (employeeJobs.Intern > charter.office.numEmployees / 3) {
        const employeesToMove =
          employeeJobs.Intern - Math.floor(charter.office.numEmployees / 3);
        employeeJobs.Intern -= employeesToMove;
        employeeJobs[jobTitleWithLeastProduction] += employeesToMove;
      } else if (
        charter.office.avgMorale < charter.office.maxMorale ||
        charter.office.avgEnergy < charter.office.maxEnergy
      ) {
        employeeJobs.Intern++;
        for (let i = necessaryJobTitles.length - 1; i >= 0; i--) {
          if (employeeJobs[necessaryJobTitles[i]] > 0) {
            employeeJobs[necessaryJobTitles[i]]--;
            break;
          }
        }
      } else {
        employeeJobs.Intern = 0;
      }
    }

    // Assign jobs.
    const entries = Object.entries(employeeJobs);
    entries.sort((entry1, entry2) => {
      const [jobTitle1, employeeCount1] = entry1;
      const [jobTitle2, employeeCount2] = entry2;
      const oldEmployeeJobs = charter.office.employeeJobs;
      const oldEmployeeCount1 = oldEmployeeJobs[jobTitle1];
      const oldEmployeeCount2 = oldEmployeeJobs[jobTitle2];
      const delta1 = employeeCount1 - oldEmployeeCount1;
      const delta2 = employeeCount2 - oldEmployeeCount2;
      return delta1 - delta2;
    });
    for (const entry of entries) {
      ns.corporation.setAutoJobAssignment(
        divisionName,
        city,
        entry[0],
        entry[1]
      );
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageProductionMaterials(ns, charters) {
  for (const charter of charters) {
    if (!charter.hasWarehouse) continue;

    const allocatedMaterialStorage = charter.warehouse.size / 2;

    // Remove excess production material.
    for (const materialName of PRODUCTION_MATERIAL_NAMES) {
      const charterMaterial = charter.getCharterMaterial(materialName);

      const materialStored = charterMaterial.material.stored;
      if (materialStored === 0) continue;

      if (materialName !== charter.mostEffectiveProductionMaterialName) {
        // Remove all materials that are not the most effective production
        // material.
        sellMaterial(
          ns,
          materialName,
          materialStored,
          charter,
          chartersWithWarehouses
        );

        // Do not continue to buy this material.
        ns.corporation.buyMaterial(
          charter.division.name,
          charter.office.city,
          materialName,
          0
        );

        // Cancel any imports of this material.
        cancelImports(ns, materialName, charter, chartersWithWarehouses);
        continue;
      }

      // Remove materials of this type until it only takes up half the warehouse
      // space.
      if (charterMaterial.spaceTakenUp > allocatedMaterialStorage) {
        const amountToSell =
          (charterMaterial.spaceTakenUp - allocatedMaterialStorage) /
          charterMaterial.materialData.size;
        sellMaterial(
          ns,
          materialName,
          amountToSell,
          charter,
          chartersWithWarehouses
        );
      }
    }

    // Add most effective production material.
    const materialName = charter.mostEffectiveProductionMaterialName;
    const charterMaterial = charter.getCharterMaterial(materialName);
    if (charterMaterial.spaceTakenUp < allocatedMaterialStorage) {
      const amountToBuy =
        (allocatedMaterialStorage - charterMaterial.spaceTakenUp) /
        charterMaterial.materialData.size;
      buyMaterial(
        ns,
        materialName,
        amountToBuy,
        charter,
        chartersWithWarehouses,
        true
      );
    }
  }
}

/**
 * Sells material at the most profitable charter.
 *
 * @param {NS} ns
 * @param {import('../NetscriptDefinitions').CorpMaterialName} materialName
 * @param {number} amountToSell
 * @param {Charter} sourceCharter
 * @param {Charter[]} charters
 */
function sellMaterial(ns, materialName, amountToSell, sourceCharter, charters) {
  // Get only the charters that can sell the material to sell sorted from
  // highest market price to lowest market price.
  const chartersWithMaterial = charters.filter(charter =>
    charter.hasCharterMaterial(materialName)
  );
  chartersWithMaterial.sort((charter1, charter2) => {
    const getMarketPrice = (/** @type {Charter} */ charter) =>
      charter.getCharterMaterial(materialName).material.marketPrice;
    return getMarketPrice(charter2) - getMarketPrice(charter1);
  });

  // Sell material from the highest market price to lowest market price based on
  // the target city's actual sell amount.
  for (const targetCharter of chartersWithMaterial) {
    if (amountToSell <= 0) break;

    const material = targetCharter.getCharterMaterial(materialName).material;

    let actualSellAmount = material.actualSellAmount;
    if (actualSellAmount === 0) {
      // If the actual sell amount is 0, then that might mean that this charter
      // has never sold this item before, so sell the max and this will readjust
      // in the next tick.
      actualSellAmount = amountToSell;
    }
    if (targetCharter !== sourceCharter) {
      // Export only the amount that the target charter can sell.
      exportMaterial(
        ns,
        materialName,
        actualSellAmount,
        sourceCharter,
        targetCharter
      );
    }

    // Set market TA I and II if they're not already set.
    try {
      ns.corporation.setMaterialMarketTA1(
        targetCharter.division.name,
        targetCharter.office.city,
        materialName,
        true
      );
      ns.corporation.setMaterialMarketTA2(
        targetCharter.division.name,
        targetCharter.office.city,
        materialName,
        true
      );
    } catch (e) {}

    // Sell only the amount that the target charter can sell.
    ns.corporation.sellMaterial(
      targetCharter.division.name,
      targetCharter.office.city,
      materialName,
      actualSellAmount,
      'MP'
    );

    amountToSell -= actualSellAmount;
  }
}

/**
 * Buys material at the cheapest charter.
 *
 * @param {NS} ns
 * @param {import('../NetscriptDefinitions').CorpMaterialName} materialName
 * @param {number} amountToBuy
 * @param {Charter} sourceCharter
 * @param {Charter[]} charters
 * @param {boolean} [inBulk]
 *        if set to true, buy one time in bulk. Otherwise, continuously buy
 */
function buyMaterial(
  ns,
  materialName,
  amountToBuy,
  sourceCharter,
  charters,
  inBulk
) {
  const chartersWithMaterial = charters.filter(charter =>
    charter.hasCharterMaterial(materialName)
  );
  const lowestMarketPrice = Math.min(
    ...chartersWithMaterial.map(
      charter => charter.getCharterMaterial(materialName).material.marketPrice
    )
  );
  const targetCharter = chartersWithMaterial.find(
    charter =>
      charter.getCharterMaterial(materialName).material.marketPrice ===
      lowestMarketPrice
  );

  // Buy from target charter.
  if (inBulk) {
    // Only buy the amount that we don't have in the target charter warehouse.
    const charterMaterial = targetCharter.getCharterMaterial(materialName);
    let actualAmountToBuy = amountToBuy - charterMaterial.material.stored;

    // Only buy the amount that we can fit in the warehouse.
    const availableSpace =
      targetCharter.warehouse.size - targetCharter.warehouse.sizeUsed;
    const materialSize = charterMaterial.materialData.size;
    actualAmountToBuy = Math.min(
      actualAmountToBuy,
      availableSpace / materialSize
    );

    try {
      ns.corporation.bulkPurchase(
        targetCharter.division.name,
        targetCharter.office.city,
        materialName,
        actualAmountToBuy
      );
    } catch (e) {
      // Probably couldn't afford this.
    }
  } else {
    ns.corporation.buyMaterial(
      targetCharter.division.name,
      targetCharter.office.city,
      materialName,
      amountToBuy
    );
  }

  if (targetCharter !== sourceCharter) {
    // Export to source charter.
    exportMaterial(ns, materialName, amountToBuy, targetCharter, sourceCharter);
  }
}

/**
 * @param {NS} ns
 * @param {import('../NetscriptDefinitions').CorpMaterialName} materialName
 * @param {number} amountToExport
 * @param {Charter} sourceCharter charter to export from
 * @param {Charter} targetCharter charter to import to
 */
function exportMaterial(
  ns,
  materialName,
  amountToExport,
  sourceCharter,
  targetCharter
) {
  const targetDivision = targetCharter.division.name;
  const targetCity = targetCharter.office.city;
  const sourceDivision = sourceCharter.division.name;
  const sourceCity = sourceCharter.office.city;
  ns.corporation.cancelExportMaterial(
    sourceDivision,
    sourceCity,
    targetDivision,
    targetCity,
    materialName
  );
  ns.corporation.exportMaterial(
    sourceDivision,
    sourceCity,
    targetDivision,
    targetCity,
    materialName,
    amountToExport
  );
}

/**
 * Cancel any exports of a material to a city.
 *
 * @param {NS} ns
 * @param {import('../NetscriptDefinitions').CorpMaterialName} materialName
 * @param {Charter} importCharter charter to cancel exports to
 * @param {Charter[]} charters
 */
function cancelImports(ns, materialName, importCharter, charters) {
  for (const charter of charters) {
    if (!charter.hasCharterMaterial(materialName)) continue;

    const charterMaterial = charter.getCharterMaterial(materialName);
    for (const exportOrder of charterMaterial.material.exports) {
      if (exportOrder.division !== importCharter.division.name) continue;
      if (exportOrder.city !== importCharter.office.city) continue;
      ns.corporation.cancelExportMaterial(
        charter.division.name,
        charter.office.city,
        importCharter.division.name,
        importCharter.office.city,
        materialName
      );
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageMaterials(ns, charters) {
  for (const charter of charters) {
    if (!charter.warehouse) continue;
    for (const materialName of charter.industryData.producedMaterials ?? []) {
      try {
        ns.corporation.sellMaterial(
          charter.division.name,
          charter.office.city,
          materialName,
          'MAX',
          'MP'
        );
        ns.corporation.setMaterialMarketTA1(
          charter.division.name,
          charter.office.city,
          materialName,
          true
        );
        ns.corporation.setMaterialMarketTA2(
          charter.division.name,
          charter.office.city,
          materialName,
          true
        );
      } catch (_) {}
    }
  }
}
