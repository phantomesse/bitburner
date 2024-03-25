import { ONE_SECOND } from 'utils/time';

/**
 * Manage sleeves.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const sleeveCount = ns.sleeve.getNumSleeves();
    for (let i = 0; i < sleeveCount; i++) {
      const sleeve = ns.sleeve.getSleeve(i);

      // Make sure that the sleeve is not idle.
      if (sleeve.shock > 0) {
        ns.sleeve.setToShockRecovery(i);
      } else if (sleeve.sync < 100) {
        ns.sleeve.setToSynchronize(i);
      } else {
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', 'Agility');
      }
    }

    await ns.sleep(ONE_SECOND);
  }
}
