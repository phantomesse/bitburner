import {
  CharterMaterial,
  PRODUCTION_MATERIAL_NAMES,
} from 'corporation/charter-material';

/**
 * A Charter represents an office of a division (e.g. Aevum of the Agriculture
 * Division).
 */
export class Charter {
  /**
   * @param {NS} ns
   * @param {import("../../NetscriptDefinitions").Division} division
   * @param {import("../../NetscriptDefinitions").Office} office
   */
  constructor(ns, division, office) {
    this.division = division;
    this.divisionName = division.name;
    this.office = office;
    this.city = office.city;
    this.industryData = ns.corporation.getIndustryData(division.type);

    this.hasWarehouse = ns.corporation.hasWarehouse(
      this.divisionName,
      this.city
    );
    this.warehouse = this.hasWarehouse
      ? ns.corporation.getWarehouse(division.name, office.city)
      : null;

    /** Name of all the research that we have no researched yet. */
    const constants = ns.corporation.getConstants();
    this.lockedResearchNames = (
      this.industryData.makesProducts
        ? constants.researchNames
        : constants.researchNamesBase
    ).filter(
      researchName => !ns.corporation.hasResearched(division.name, researchName)
    );
    this.needsResearchers = this.lockedResearchNames.length > 0;
    this.needsInterns =
      (this.lockedResearchNames.includes('AutoBrew') ||
        this.lockedResearchNames.includes('AutoPartyManager')) &&
      (office.avgMorale < 100 || office.avgEnergy < 100);

    this.charterMaterials = this._getMaterials(ns);
    this.mostEffectiveProductionMaterialName =
      this._getMostEffectiveProductionMaterialName(ns);
  }

  /**
   * @param {import('../../NetscriptDefinitions').CorpMaterialName} materialName
   * @returns {boolean} whether this charter can buy/sell this material.
   */
  hasCharterMaterial(materialName) {
    return (
      this.charterMaterials.filter(
        charterMaterial => charterMaterial.material.name === materialName
      ).length > 0
    );
  }

  /**
   * @param {import('../../NetscriptDefinitions').CorpMaterialName} materialName
   * @returns {CharterMaterial} material to get
   */
  getCharterMaterial(materialName) {
    if (!this.hasCharterMaterial(materialName)) {
      throw `${this} does not have ${materialName}`;
    }
    return this.charterMaterials.find(
      charterMaterial => charterMaterial.material.name === materialName
    );
  }

  /**
   * @param {NS} ns
   * @returns {CharterMaterial} all materials available to buy/sell
   */
  _getMaterials(ns) {
    if (!this.warehouse) {
      return [];
    }
    const materialNames = [
      ...Object.keys(this.industryData.requiredMaterials ?? {}),
      ...(this.industryData.producedMaterials || []),
      ...PRODUCTION_MATERIAL_NAMES,
    ];
    return materialNames.map(materialName => {
      const material = ns.corporation.getMaterial(
        this.divisionName,
        this.city,
        materialName
      );
      return new CharterMaterial(ns, material);
    });
  }

  /**
   * @param {NS} ns
   * @returns {import('corporation/charter-material').ProductionMaterialName}
   *          name of the most effective production material
   */
  _getMostEffectiveProductionMaterialName(ns) {
    const materialNameToFactorMap = {
      Hardware: this.industryData.hardwareFactor,
      Robots: this.industryData.robotFactor,
      'AI Cores': this.industryData.aiCoreFactor,
      'Real Estate': this.industryData.realEstateFactor,
    };
    const highestFactor = Math.max(...Object.values(materialNameToFactorMap));
    const materialNamesWithHighestFactor = Object.keys(
      materialNameToFactorMap
    ).filter(
      materialName => materialNameToFactorMap[materialName] === highestFactor
    );

    // If there is only one material, then return that material.
    if (materialNamesWithHighestFactor.length === 1) {
      return materialNamesWithHighestFactor[0];
    }

    // Otherwise return the material with the lowest base cost.
    materialNamesWithHighestFactor.sort(
      (materialName1, materialName2) =>
        ns.corporation.getMaterialData(materialName1).baseCost -
        ns.corporation.getMaterialData(materialName2).baseCost
    );
    return materialNamesWithHighestFactor[0];
  }

  toString() {
    return `${this.divisionName} - ${this.city}`;
  }
}

/**
 * @param {NS} ns
 * @returns {Charter[]} all existing charters
 */
export function getCharters(ns) {
  /** @type {Charter[]} */ const charters = [];

  const divisions = ns.corporation
    .getCorporation()
    .divisions.map(divisionName => ns.corporation.getDivision(divisionName));
  for (const division of divisions) {
    const offices = division.cities.map(city =>
      ns.corporation.getOffice(division.name, city)
    );
    charters.push(...offices.map(office => new Charter(ns, division, office)));
  }

  return charters;
}
