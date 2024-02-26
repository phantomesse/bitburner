import { ONE_MINUTE, ONE_SECOND } from 'utils/constants';

class Gym {
  /**
   * @param {NS} ns
   * @param {string} gymName
   * @param {string} city
   */
  constructor(ns, gymName, city) {
    this.gymName = gymName;
    this.city = city;
  }
}

/**
 * Workout at the best gym.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const gyms = Object.keys(ns.enums.LocationName)
    .filter(key => key.endsWith('Gym'))
    .map(gymKey => {
      const gymName = ns.enums.LocationName[gymKey];
      const cityKeys = Object.keys(ns.enums.CityName);
      const city =
        ns.enums.CityName[
          cityKeys.filter(cityKey => gymKey.startsWith(cityKey))
        ];
      return new Gym(ns, gymName, city);
    });

  const citiesWithGyms = [new Set(gyms.map(gym => gym.city))];
  const currentCity = ns.getPlayer().city;
  if (citiesWithGyms.includes(currentCity)) {
    await workout(
      ns,
      gyms.find(gym => gym.city === currentCity)
    );
  } else {
    ns.singularity.travelToCity(gyms[0].city);
    await workout(ns, gyms[0]);
  }
}

/**
 * @param {NS} ns
 * @param {Gym} gym
 */
async function workout(ns, gym) {
  while (true) {
    const currentSkills = ns.getPlayer().skills;
    const skills = Object.keys(ns.enums.GymType).sort(
      (skill1, skill2) => currentSkills[skill1] - currentSkills[skill2]
    );
    ns.singularity.gymWorkout(
      gym.gymName,
      ns.enums.GymType[skills[0]],
      ns.singularity.isFocused()
    );
    await ns.sleep(ONE_SECOND * 30);
  }
}
