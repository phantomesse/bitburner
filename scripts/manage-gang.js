import { getMoneyToSpend } from '/utils/misc.js';

/**
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  if (!ns.gang.inGang()) return;

  const equipmentNames = ns.gang.getEquipmentNames();

  while (true) {
    // Recruit new members.
    while (ns.gang.canRecruitMember()) {
      const name =
        GANG_MEMBER_NAMES[
          Math.floor(Math.random() * GANG_MEMBER_NAMES.length)
        ] + SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      while (!ns.gang.recruitMember(name));
      ns.gang.setMemberTask(name, 'Train Combat');
    }

    const memberNames = ns.gang.getMemberNames();
    for (const memberName of memberNames) {
      // Ascend.
      const ascensionResult = ns.gang.getAscensionResult(memberName);
      if (ascensionResult != null) {
        const memberInfo = ns.gang.getMemberInformation(memberName);
        if (
          ascensionResult.hack > memberInfo.hack_asc_mult * 1.5 ||
          ascensionResult.str > memberInfo.str_asc_mult * 1.5 ||
          ascensionResult.dex > memberInfo.dex_asc_mult * 1.5 ||
          ascensionResult.def > memberInfo.def_asc_mult * 1.5 ||
          ascensionResult.agi > memberInfo.agi_asc_mult * 1.5 ||
          ascensionResult.cha > memberInfo.cha_asc_mult * 1.5
        ) {
          ns.gang.ascendMember(memberName);
        }
      }

      // Assign task.
      const clashChance = ns.gang.getGangInformation().territoryClashChance;
      if (clashChance > 0) {
        if (
          memberNames.indexOf(memberName) <=
          Math.ceil(memberNames.length * Math.min(clashChance, 0.5))
        ) {
          ns.gang.setMemberTask(memberName, 'Territory Warfare');
          continue;
        }
      }
      if (
        ns.gang.getGangInformation().wantedPenalty < 0.5 &&
        ns.gang.getGangInformation().wantedLevel > 1
      ) {
        ns.gang.setMemberTask(memberName, 'Vigilante Justice');
        continue;
      }
      for (let i = TASKS.length - 1; i >= 0; i--) {
        ns.gang.setMemberTask(memberName, TASKS[i]);
        await ns.sleep(10);
        if (ns.gang.getMemberInformation(memberName).moneyGain > 0) {
          break;
        }
      }

      // Buy equipment.
      for (const equipmentName of equipmentNames) {
        if (ns.gang.getEquipmentCost(equipmentName) < getMoneyToSpend(ns)) {
          if (ns.gang.purchaseEquipment(memberName, equipmentName)) break;
        }
      }
    }

    await ns.sleep(1000);
  }
}

const TASKS = [
  'Mug People',
  'Deal Drugs',
  'Strongarm Civilians',
  'Run a Con',
  'Armed Robbery',
  'Traffick Illegal Arms',
  'Threaten & Blackmail',
  'Human Trafficking',
  'Terrorism',
];

const SUFFIXES = ['', ' Jr', ' III', ' the Great'];

const GANG_MEMBER_NAMES = [
  'Gabby',
  'Gabe',
  'Gabriel',
  'Gabriella',
  'Gage',
  'Garcia',
  'Gareth',
  'Garland',
  'Garret',
  'Gary',
  'Gaston',
  'Gates',
  'Gavin',
  'Geary',
  'Gemma',
  'Gene',
  'Genesis',
  'Geneva',
  'Genevieve',
  'Genie',
  'Geoffrey',
  'George',
  'Gerald',
  'Geraldine',
  'Geraldo',
  'German',
  'Germany',
  'Gertrude',
  'Gia',
  'Gibson',
  'Gigi',
  'Gilbert',
  'Giles',
  'Gina',
  'Ginger',
  'Ginny',
  'Gino',
  'Gio',
  'Giovanni',
  'Giselle',
  'Giuseppe',
  'Gizelle',
  'Gladys',
  'Glenn',
  'Gloria',
  'Grace',
  'Gracelyn',
  'Graeme',
  'Grant',
  'Grayson',
  'Gregory',
  'Greta',
  'Gretel',
  'Gryffin',
  'Guillermo',
  'Gus',
  'Gustavo',
  'Guy',
  'Gwen',
  'Gwendolyn',
  'Gypsy',
];
