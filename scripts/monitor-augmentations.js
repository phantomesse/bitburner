import { HOME_HOSTNAME, ONE_MINUTE, ONE_SECOND } from 'utils/constants';
import { createReactElement } from 'utils/dom';
import { formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

const NEUROFLUX_GOVERNOR = 'NeuroFlux Governor';
const COMBAT_STAT_NAMES = ['strength', 'defense', 'dexterity', 'agility'];

class Augmentation {
  /**
   * @param {NS} ns
   * @param {string} name augmentation name
   */
  constructor(ns, name) {
    this.name = name;
    this.price = ns.singularity.getAugmentationPrice(name);

    // Only include factions where there is enough reputation to buy this
    // augmentation.
    const reputationRequired = ns.singularity.getAugmentationRepReq(this.name);

    this.factions = ns.singularity
      .getAugmentationFactions(this.name)
      .filter(
        faction => ns.singularity.getFactionRep(faction) >= reputationRequired
      );
    try {
      const gangFaction = ns.gang.getGangInformation().faction;
      const gangFactionAugmentations =
        ns.singularity.getAugmentationsFromFaction(gangFaction);
      if (name === NEUROFLUX_GOVERNOR) {
        this.factions = this.factions.filter(
          faction => faction !== gangFaction
        );
      } else {
        if (
          gangFactionAugmentations.includes(this.name) &&
          ns.singularity.getFactionRep(gangFaction) >= reputationRequired
        ) {
          this.factions.push(gangFaction);
        }
      }
    } catch (_) {}
  }

  /**
   * @param {NS} ns
   * @returns {boolean} whether we can buy this augmentation right now
   */
  canBuy(ns) {
    if (this.factions.length === 0) return false;

    // Check that we don't already own this augmentation.
    const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);
    if (
      !this.name.includes(NEUROFLUX_GOVERNOR) &&
      ownedAugmentations.includes(this.name)
    ) {
      return false;
    }

    // Check that we have all the prereq augmentations.
    const requiredAugmentations = ns.singularity.getAugmentationPrereq(
      this.name
    );
    for (const requiredAugmentation of requiredAugmentations) {
      if (!ownedAugmentations.includes(requiredAugmentation)) return false;
    }

    return true;
  }

  /** @param {NS} ns */
  getDescription(ns) {
    if (this.name === NEUROFLUX_GOVERNOR) return 'all: +1%';

    const stats = Object.fromEntries(
      Object.entries(ns.singularity.getAugmentationStats(this.name)).filter(
        entry => entry[1] > 1
      )
    );

    // Combine combat stats if needed.
    function combineStats(stats, statNamesToCombine, combinedStatName) {
      const uniqueValues = new Set(
        statNamesToCombine
          .map(statName => stats[statName])
          .filter(value => value != null)
      );
      if (uniqueValues.size !== 1) return;
      stats[combinedStatName] = [...uniqueValues][0];
      for (const statName of statNamesToCombine) delete stats[statName];
    }
    combineStats(stats, COMBAT_STAT_NAMES, 'combat');
    combineStats(
      stats,
      COMBAT_STAT_NAMES.map(statName => `${statName}_exp`),
      'combat_exp'
    );

    return Object.entries(stats)
      .sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]))
      .map(entry => {
        const statName = entry[0].replace('_', ' ');
        const message = `${statName}: +${ns.formatPercent(entry[1] - 1, 0)}`;
        let color = ns.ui.getTheme().combat;
        if (statName.includes('hacking')) color = ns.ui.getTheme().hack;
        if (statName.includes('charisma')) color = ns.ui.getTheme().cha;
        if (statName.includes('money')) color = ns.ui.getTheme().money;
        if (statName.includes('rep')) color = ns.ui.getTheme().rep;
        return createReactElement(message, { color: color });
      });
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

    const augmentations = [
      ...new Set(
        ns
          .getPlayer()
          .factions.map(ns.singularity.getAugmentationsFromFaction)
          .flat()
      ),
    ]
      .map(augmentationName => new Augmentation(ns, augmentationName))
      .filter(augmentation => augmentation.canBuy(ns))
      .sort(
        (augmentation1, augmentation2) =>
          augmentation1.price - augmentation2.price
      );

    const money = ns.getServerMoneyAvailable(HOME_HOSTNAME);
    /** @type {import('utils/table').Table} */ const table = { rows: [] };
    for (const augmentation of augmentations) {
      const canAfford = money >= augmentation.price;

      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Augmentation', style: { width: 'max-content' } },
            content: augmentation.name,
          },
          {
            column: { name: 'Description', style: { width: 'max-content' } },
            content: augmentation.getDescription(ns),
          },
          {
            column: { name: 'Price', style: { width: 'min-content' } },
            content: formatMoney(ns, augmentation.price),
          },
          {
            column: { name: 'Factions', style: {} },
            content: augmentation.factions.join('\n'),
          },
        ],
        ...(canAfford ? { style: { color: ns.ui.getTheme().success } } : {}),
      };
      table.rows.push(row);
    }
    printTable(ns, table);

    await ns.sleep(ONE_SECOND);
  }
}
