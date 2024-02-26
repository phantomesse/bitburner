import { ONE_SECOND } from 'utils/constants';
import { printTable } from 'utils/table';

class Faction {
  /**
   * @param {NS} ns
   * @param {string} name faction name
   */
  constructor(ns, name) {
    this.name = name;
    this.reputation = ns.singularity.getFactionRep(name);
    this.currentFavor = Math.round(ns.singularity.getFactionFavor(name));
    this.favorGain = Math.round(ns.singularity.getFactionFavorGain(name));

    const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);
    const augmentations = ns.singularity
      .getAugmentationsFromFaction(name)
      .filter(augmentation => !ownedAugmentations.includes(augmentation));
    this.augmentationCount = augmentations.length;

    this.reputationUntilNextAugmentationUnlock =
      (augmentations
        .map(augmentation => ns.singularity.getAugmentationRepReq(augmentation))
        .filter(reputation => reputation > this.reputation)
        .sort()[0] ?? this.reputation) - this.reputation;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.resizeTail(900, 600);
  ns.moveTail(500, 200);
  ns.atExit(() => ns.closeTail());

  while (true) {
    ns.clearLog();

    const joinedFactions = ns
      .getPlayer()
      .factions.map(factionName => new Faction(ns, factionName))
      .sort(
        (faction1, faction2) => faction2.currentFavor - faction1.currentFavor
      );

    /** @type {import('utils/table').Table} */ const table = { rows: [] };
    for (const faction of joinedFactions) {
      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Faction', style: {} },
            content: faction.name,
          },
          {
            column: {
              name: 'Reputation',
              style: { textAlign: 'right', width: 'max-content' },
            },
            content: ns.formatNumber(faction.reputation),
          },
          {
            column: {
              name: 'Current Favor',
              style: { textAlign: 'center', width: 'max-content' },
            },
            content:
              ns.formatNumber(faction.currentFavor, 0) +
              ` (+${ns.formatNumber(faction.favorGain, 0)})`,
          },
          {
            column: {
              name: 'Net Favor',
              style: { textAlign: 'right', width: 'max-content' },
            },
            content: ns.formatNumber(
              faction.currentFavor + faction.favorGain,
              0
            ),
          },
          {
            column: {
              name: 'Augmentations Left',
              style: { textAlign: 'center' },
            },
            content:
              faction.augmentationCount === 0
                ? '-'
                : `${faction.augmentationCount} (need ${ns.formatNumber(
                    faction.reputationUntilNextAugmentationUnlock
                  )} rep)`,
          },
        ],
      };
      table.rows.push(row);
    }
    printTable(ns, table);

    await ns.sleep(ONE_SECOND);
  }
}
