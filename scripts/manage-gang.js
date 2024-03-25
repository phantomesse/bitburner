import { ONE_SECOND } from 'utils/time';

const POTENTIAL_GANG_MEMBER_NAMES = [
  'Abyss',
  'Beast',
  'Bullet',
  'Catalyst',
  'Cipher',
  'Cobra',
  'Echo',
  'Eclipse',
  'Enigma',
  'Frost',
  'Ghost',
  'Havoc',
  'Haze',
  'Inferno',
  'Obsidian',
  'Omega',
  'Phantom',
  'Phoenix',
  'Razor',
  'Renegade',
  'Riptide',
  'Scorpion',
  'Shadow',
  'Spike',
  'Storm',
  'Tempest',
  'Thunder',
  'Venom',
  'Viper',
  'Vortex',
];

/**
 * Manages gang.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // const gangInfo = ns.gang.getGangInformation();
  // const gangMembers = ns.gang.getMemberNames();

  while (true) {
    maybeRecruitGangMember(ns);

    await ns.sleep(ONE_SECOND);
  }
}

/**
 * Recruit a new gang member.
 *
 * @param {NS} ns
 */
function maybeRecruitGangMember(ns) {
  const randomIndex = Math.floor(
    Math.random() * POTENTIAL_GANG_MEMBER_NAMES.length
  );
  const name = POTENTIAL_GANG_MEMBER_NAMES[randomIndex];
  const wasSuccessful = ns.gang.recruitMember(name);
  if (wasSuccessful) ns.toast(`Recruited ${name} to gang`);
}
