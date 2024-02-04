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
    const offices = getOffices(ns);
    maximizeProduction(ns, offices);
    await ns.corporation.nextUpdate();
  }
}

/**
 * @typedef OfficeDatum
 * @property {Office} office
 * @property {CorpMaterialName} mostImpactfulMaterial
 * @property {Object.<CorpMaterialName, number>} productionMaterialToSizeMap
 *           production material to the amount of the warehouse it's taking up
 * @property {Object.<CorpMaterialName, number>} productionMaterialToMarketPriceMap
 *           production material to market price
 *
 * Maximize production by filling half the warehouse for each office with the
 * most impactful material.
 *
 * @param {NS} ns
 * @param {Office[]} offices
 */
function maximizeProduction(ns, offices) {
  const officesWithWarehouses = offices.filter(office =>
    ns.corporation.hasWarehouse(office.division.name, office.office.city)
  );

  const productionMaterialNames = [
    'Hardware',
    'Robots',
    'AI Cores',
    'Real Estate',
  ];

  /** @type {OfficeDatum[]} */ const officesData = [];
  for (const office of officesWithWarehouses) {
    // Get the most impactful material factor.
    const industryData = ns.corporation.getIndustryData(office.division.type);
    const materialFactors = {
      Hardware: industryData.hardwareFactor,
      Robots: industryData.robotFactor,
      'AI Cores': industryData.aiCoreFactor,
      'Real Estate': industryData.realEstateFactor,
    };
    const highestFactor = Math.max(...Object.values(materialFactors));
    const mostImpactfulMaterial = Object.entries(materialFactors).filter(
      entry => entry[1] === highestFactor
    )[0][0];

    // Get production material info.
    const materialNameToMaterialMap = Object.fromEntries(
      productionMaterialNames.map(materialName => [
        materialName,
        ns.corporation.getMaterial(
          office.division.name,
          office.office.city,
          materialName
        ),
      ])
    );
    const productionMaterialToSizeMap = Object.fromEntries(
      productionMaterialNames.map(materialName => [
        materialName,
        ns.corporation.getMaterialData(materialName).size *
          materialNameToMaterialMap[materialName].stored,
      ])
    );
    const productionMaterialToMarketPriceMap = Object.fromEntries(
      productionMaterialNames.map(materialName => [
        materialName,
        materialNameToMaterialMap[materialName].marketPrice,
      ])
    );

    officesData.push({
      office,
      mostImpactfulMaterial,
      productionMaterialToSizeMap,
      productionMaterialToMarketPriceMap,
    });
  }

  // Get where to buy and sell materials.
  const productionMaterialToCheapestOfficeMap = Object.fromEntries(
    productionMaterialNames.map(materialName => [
      materialName,
      { office: null, marketPrice: Infinity },
    ])
  );
  const productionMaterialToMostExpensiveOfficeMap = Object.fromEntries(
    productionMaterialNames.map(materialName => [
      materialName,
      { office: null, marketPrice: 0 },
    ])
  );
  for (const officeDatum of officesData) {
    for (const materialName of productionMaterialNames) {
      const marketPrice =
        officeDatum.productionMaterialToMarketPriceMap[materialName];
      if (
        productionMaterialToCheapestOfficeMap[materialName].office === null ||
        marketPrice <
          productionMaterialToCheapestOfficeMap[materialName].marketPrice
      ) {
        productionMaterialToCheapestOfficeMap[materialName] = {
          office: officeDatum.office,
          marketPrice,
        };
      }
      if (
        productionMaterialToMostExpensiveOfficeMap[materialName].office ===
          null ||
        marketPrice >
          productionMaterialToMostExpensiveOfficeMap[materialName].marketPrice
      ) {
        productionMaterialToMostExpensiveOfficeMap[materialName] = {
          office: officeDatum.office,
          marketPrice,
        };
      }
    }
  }

  for (const officeDatum of officesData) {
    const warehouseSize = ns.corporation.getWarehouse(
      officeDatum.office.division.name,
      officeDatum.office.office.city
    ).size;
    for (const materialName of productionMaterialNames) {
      const materialSize =
        officeDatum.productionMaterialToSizeMap[materialName];

      // Sell excess material.
      if (
        materialSize > 0 &&
        (materialName !== officeDatum.mostImpactfulMaterial ||
          materialSize > warehouseSize / 2)
      ) {
        const amountToSell = Math.ceil(
          (materialName === officeDatum.mostImpactfulMaterial
            ? materialSize - warehouseSize / 2
            : materialSize) / ns.corporation.getMaterialData(materialName).size
        );
        if (
          productionMaterialToMostExpensiveOfficeMap[materialName].office ===
          officeDatum.office
        ) {
          // If this city has the most expensive market price, sell.
          ns.corporation.sellMaterial(
            officeDatum.office.division.name,
            officeDatum.office.office.city,
            materialName,
            amountToSell,
            'MP'
          );
        } else {
          // Else export to most expensive MP city.
          const targetOffice =
            productionMaterialToMostExpensiveOfficeMap[materialName].office;
          ns.corporation.exportMaterial(
            officeDatum.office.division.name,
            officeDatum.office.office.city,
            targetOffice.division.name,
            targetOffice.office.city,
            materialName,
            amountToSell
          );
        }
      }
    }
  }
}

/**
 * @param {NS} ns
 * @returns {Office[]} all offices
 */
function getOffices(ns) {
  const divisions = ns.corporation
    .getCorporation()
    .divisions.map(divisionName => ns.corporation.getDivision(divisionName));
  const offices = [];
  for (const division of divisions) {
    const officeData = division.cities.map(cityName =>
      ns.corporation.getOffice(division.name, cityName)
    );
    for (const office of officeData) {
      offices.push({ division, office });
    }
  }
  return offices;
}

/**
 * @typedef Office
 * @property {import('../NetscriptDefinitions').Division} division
 * @property {import('../NetscriptDefinitions').Office} office
 */
