/**
 * @typedef {'Hardware' | 'Robots' | 'AI Cores' | 'Real Estate'} ProductionMaterialName
 */

/** @type {ProductionMaterialName} */
export const PRODUCTION_MATERIAL_NAMES = [
  'Hardware',
  'Robots',
  'AI Cores',
  'Real Estate',
];

/** Represents a Material in a Charter warehouse. */
export class CharterMaterial {
  /**
   * @param {NS} ns
   * @param {import("../../NetscriptDefinitions").Material} material
   */
  constructor(ns, material) {
    this.materialData = ns.corporation.getMaterialData(material.name);
    this.material = material;

    /** Amount of space this material is taking up in the warehouse. */
    this.spaceTakenUp = material.stored * this.materialData.size;
  }
}
