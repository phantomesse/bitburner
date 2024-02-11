const POTENTIAL_RESTAURANT_PRODUCT_NAMES = [
  'Savory Haven',
  'Urban Bites',
  'Gourmet Grove',
  'Culinary Canvas',
  'Fusion Flavors',
  'Taste Treasury',
  'Sizzle & Spice',
  'Palette Paradise',
  'Epicurean Elegance',
  'Gastronomy Junction',
];

const POTENTIAL_TOBACCO_PRODUCT_NAMES = [
  'Sparkle Stix Bliss Buds',
  'Fluff Cloud Puff Pods',
  'Rainbow Dream Wraps',
  'Bubblegum Cloud Ciglets',
  'Giggly Grove Tobacco Treats',
  'CottonCandy Cigarillos',
  'Moonbeam Shisha Swirls',
  'Wonder Leaf Whispers',
  'Marshmallow Mist Pipes',
  'Starry Skies Snuggle Sticks',
];

const POTENTIAL_PHARMACEUTICAL_PRODUCT_NAMES = [
  'Solivra',
  'Zyrron',
  'Vectralis',
  'Ecliptix',
  'Lunarisol',
  'Veridox',
  'Vortexa',
  'Exilith',
  'Nebulith',
  'Zenolyx',
];

const POTENTIAL_COMPUTER_HARDWARE_PRODUCT_NAMES = [
  'Quantum Core Processor',
  'Blaze Graph Graphics Card',
  'Nebula Link Motherboard',
  'Turbo Drive SSD',
  'Aero Cool Cooling System',
  'Titan Sync RAM Modules',
  'PhotonX Quantum Mouse',
  'Celestial Touch Keyboard',
  'Nova Stream Webcam',
  'Pulse Force Power Supply',
];

const POTENTIAL_ROBOTICS_PRODUCT_NAMES = [
  'Roomba Rover',
  'Toasty Tech Bot',
  'Blender Buddy',
  'Iron Innovator',
  'Dish Bot Pro',
  'Brew Master Bot',
  'Cleansweep Crafter',
  'Microwave Mate',
  'Chores Champion',
  'Sizzle-Serve Bot',
];

const POTENTIAL_SOFTWARE_PRODUCT_NAMES = [
  'Data-Craft Pro',
  'Data Forge',
  'Logic Loom',
  'Infusion Sheets',
  'iHarmony',
  'Infinity Desk',
  'Task Sync',
  'Focus Flow',
  'Agenda Mate',
  'DocHub',
];

const POTENTIAL_HEALTHCARE_PRODUCT_NAMES = [
  'Heal Tech Relief Patch',
  'Vita-Vista Wellness Monitor',
  'PulseCare Vitality Tonic',
  'NutriGuard Immune Boost',
  'BioBalance Energy Caps',
  'Revita-Calm Sleep-Aid',
  'Meditonic Heart Care',
  'Respira-EZ Lung Support',
  'Nourish Flow Wellness Fuel',
  'Aura Energy Essence',
];

const POTENTIAL_REAL_ESTATE_PRODUCT_NAMES = [
  'Maplewood Heights',
  'Harbor View Gardens',
  'Meadowbrook Village',
  'Sunflower Grove',
  'Riverbend Terrace',
  'Tranquil Pines Estates',
  'Serenity Springs',
  'Crescent Lakeside',
  'Willowbrook Commons',
  'Radiant Ridge District',
];

/**
 * @param {import("../../NetscriptDefinitions").CorpIndustryName} industry
 * @param  {...string} blocklist names to avoid
 * @returns {string} product name
 */
export function getPotentialProductName(industry, ...blocklist) {
  const potentialProductNames = getPotentialProductNames(industry).filter(
    productName => !blocklist.includes(productName)
  );
  return potentialProductNames[
    Math.floor(Math.random() * potentialProductNames.length)
  ];
}

/**
 * @param {import("../../NetscriptDefinitions").CorpIndustryName} industry
 * @returns {string[]} list of potential product names
 */
function getPotentialProductNames(industry) {
  switch (industry) {
    case 'Restaurant':
      return POTENTIAL_RESTAURANT_PRODUCT_NAMES;
    case 'Tobacco':
      return POTENTIAL_TOBACCO_PRODUCT_NAMES;
    case 'Pharmaceutical':
      return POTENTIAL_PHARMACEUTICAL_PRODUCT_NAMES;
    case 'Computer Hardware':
      return POTENTIAL_COMPUTER_HARDWARE_PRODUCT_NAMES;
    case 'Robotics':
      return POTENTIAL_ROBOTICS_PRODUCT_NAMES;
    case 'Software':
      return POTENTIAL_SOFTWARE_PRODUCT_NAMES;
    case 'Healthcare':
      return POTENTIAL_HEALTHCARE_PRODUCT_NAMES;
    case 'Real Estate':
      return POTENTIAL_REAL_ESTATE_PRODUCT_NAMES;
  }
}
