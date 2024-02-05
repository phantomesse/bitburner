import { Charter, getCharters } from 'corporation/charter';
import { PRODUCTION_MATERIAL_NAMES } from 'corporation/charter-material';
import { ONE_MINUTE, ONE_SECOND } from 'utils/constants';
import { formatMoney } from 'utils/format';

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
    manageResearch(ns, charters);
    manageWarehouses(ns, charters);
    manageEmployees(ns, charters);

    manageProductionMaterials(ns, charters);
    manageMaterials(ns, charters);

    await ns.corporation.nextUpdate();
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageResearch(ns, charters) {
  const chartersWithLockedResearch = charters.filter(
    charter => charter.lockedResearchNames.length > 0
  );
  for (const charter of chartersWithLockedResearch) {
    for (const researchName of charter.lockedResearchNames) {
      try {
        ns.corporation.research(charter.division.name, researchName);
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
    const divisionName = charter.division.name;
    const city = charter.office.city;
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
      ns.toast(`Purchased warehouse in ${charter}`, 'success', ONE_SECOND * 10);
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageEmployees(ns, charters) {
  for (const charter of charters) {
    const divisionName = charter.division.name;
    const city = charter.office.city;

    const assignJobs = (jobTitle, employeeCount) => {
      ns.corporation.setAutoJobAssignment(
        divisionName,
        city,
        jobTitle,
        employeeCount
      );
    };

    // Rebalance employees based on productivity.
    /** @type {import('../NetscriptDefinitions').CorpEmployeePosition[]} */
    const jobTitles = [];
    const hasWarehouse = charter.warehouse !== null;
    if (hasWarehouse) {
      jobTitles.push('Operations', 'Engineer', 'Business', 'Management');
    } else {
      assignJobs('Operations', 0);
      assignJobs('Engineer', 0);
      assignJobs('Business', 0);
    }
    if (charter.lockedResearchNames.length > 0 || !hasWarehouse) {
      jobTitles.push('Research & Development');
    } else {
      assignJobs('Research & Development', 0);
    }
    if (
      charter.lockedResearchNames.includes('AutoBrew') ||
      charter.lockedResearchNames.includes('AutoPartyManager')
    ) {
      jobTitles.push('Intern');
    } else {
      assignJobs('Intern', 0);
    }

    let movingEmployee = false;
    if (
      jobTitles.filter(jobTitle => charter.office.employeeJobs[jobTitle] === 0)
        .length > 0
    ) {
      // Assign jobs evenly by employee count since we don't have production
      // per job data.
      const employeeCountPerJob = Math.floor(
        charter.office.numEmployees / jobTitles.length
      );
      for (const jobTitle of jobTitles) {
        const employeeCount =
          employeeCountPerJob +
          (jobTitle === jobTitles[0]
            ? charter.office.numEmployees % employeeCountPerJob
            : 0);
        assignJobs(jobTitle, employeeCount);
      }
    } else {
      // Assign jobs by production by replacing the one employee from the most
      // production job to the least production job.

      // Sort job titles from least production to most production
      jobTitles.sort(
        (jobTitle1, jobTitle2) =>
          charter.office.employeeProductionByJob[jobTitle1] -
          charter.office.employeeProductionByJob[jobTitle2]
      );

      // Move one employee from most production job to least production job.
      const mostProductionJob = jobTitles.slice(-1)[0];
      assignJobs(
        mostProductionJob,
        charter.office.employeeJobs[mostProductionJob] - 1
      );
      movingEmployee = true;
    }

    // Try to upgrade office size.
    ns.corporation.upgradeOfficeSize(divisionName, city, 1);

    // Try to hire more employees.
    ns.corporation.hireEmployee(divisionName, city, jobTitles[0]);

    // Assign any unassigned.
    if (charter.office.employeeJobs.Unassigned > 0) {
      assignJobs(
        jobTitles[0],
        charter.office.employeeJobs[jobTitles[0]] +
          charter.office.employeeJobs.Unassigned +
          (movingEmployee ? 1 : 0)
      );
    }
  }
}

/**
 * @param {NS} ns
 * @param {Charter[]} charters
 */
function manageProductionMaterials(ns, charters) {
  const chartersWithWarehouses = charters.filter(charter => charter.warehouse);
  for (const charter of chartersWithWarehouses) {
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
    for (const materialName of charter.industryData.producedMaterials ?? []) {
      ns.corporation.sellMaterial(
        charter.division.name,
        charter.office.city,
        materialName,
        'MAX',
        'MP'
      );

      try {
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
