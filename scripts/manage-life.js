const DISABLE_LOGGING_FUNCTIONS = ['sleep'];

const WORKING_WORK_TYPES = [
  'Working for Company part-time',
  'Working for Company',
];

const CITY_TO_GYM_MAP = {
  'Sector-12': 'powerhouse gym',
  Volhaven: 'millenium fitness gym',
  Aevum: 'snap fitness gym',
};

const CITY_TO_UNIVERSITY_MAP = {
  'Sector-12': 'rothman university',
  Volhaven: 'zb institute of technology',
  Aevum: 'summit university',
};

/**
 * Manages life when we're not busy playing.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    const player = ns.getPlayer();

    if (
      ns.isBusy() &&
      (WORKING_WORK_TYPES.includes(player.workType) ||
        player.crimeType !== '' ||
        player.createProgramName !== '' ||
        player.currentWorkFactionName !== '')
    ) {
      // Working at a job or doing a crime, so keep on working.
      await ns.sleep(10000);
      continue;
    }

    const lowestSkill = Math.min(
      player.hacking,
      player.charisma,
      player.strength,
      player.defense,
      player.dexterity,
      player.agility
    );
    if (ns.isBusy() && player.workType.startsWith('Study')) {
      // Studying or Taking a class at university
      switch (player.className) {
        case 'training your strength at a gym':
          if (lowestSkill != player.strength) ns.stopAction();
          break;
        case 'training your defense at a gym':
          if (lowestSkill != player.defense) ns.stopAction();
          break;
        case 'training your dexterity at a gym':
          if (lowestSkill != player.dexterity) ns.stopAction();
          break;
        case 'training your agility at a gym':
          if (lowestSkill != player.agility) ns.stopAction();
          break;
        case 'taking a Leadership course':
          if (lowestSkill != player.charisma) ns.stopAction();
          break;
        case 'taking an Algorithms course':
          if (lowestSkill != player.hacking) ns.stopAction();
          break;
        default:
          // Not sure what class we're taking, but stop it!
          ns.stopAction();
      }
      if (ns.isBusy()) {
        await ns.sleep(10000);
        continue;
      }
    }

    // Player is no longer busy, so start learning something!
    if (
      player.city in CITY_TO_GYM_MAP &&
      player.city in CITY_TO_UNIVERSITY_MAP
    ) {
      const gym = CITY_TO_GYM_MAP[player.city];
      const university = CITY_TO_UNIVERSITY_MAP[player.city];
      switch (lowestSkill) {
        case player.strength:
          ns.gymWorkout(gym, 'strength');
          break;
        case player.defense:
          ns.gymWorkout(gym, 'defense');
          break;
        case player.dexterity:
          ns.gymWorkout(gym, 'dexterity');
          break;
        case player.agility:
          ns.gymWorkout(gym, 'agility');
          break;
        case player.charisma:
          ns.universityCourse(university, 'Leadership');
          break;
        case player.hacking:
          ns.universityCourse(university, 'Algorithms');
          break;
        default:
          // Should never get here.
          ns.universityCourse(university, 'Leadership');
      }
    }
    await ns.sleep(10000);
  }
}
