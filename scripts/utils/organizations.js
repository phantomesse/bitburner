const ORGANIZATIONS = {
  ECorp: { stockSymbol: 'ECP', serverName: 'ecorp' },
  MegaCorp: { stockSymbol: 'MGCP', serverName: 'megacorp' },
  'Blade Industries': { stockSymbol: 'BLD', serverName: 'blade' },
  'Clarke Incorporated': { stockSymbol: 'CLRK', serverName: 'clarkinc' },
  'OmniTek Incorporated': { stockSymbol: 'OMTK', serverName: 'omnitek' },
  'Four Sigma': { stockSymbol: 'FSIG', serverName: '4sigma' },
  'KuaiGong International': { stockSymbol: 'KGI', serverName: 'kuai-gong' },
  'Fulcrum Technologies': { stockSymbol: 'FLCM', serverName: 'fulcrumtech' },
  'Storm Technologies': { stockSymbol: 'STM', serverName: 'stormtech' },
  DefComm: { stockSymbol: 'DCOMM', serverName: 'defcomm' },
  'Helios Labs': { stockSymbol: 'HLS', serverName: 'helios' },
  VitaLife: { stockSymbol: 'VITA', serverName: 'vitalife' },
  'Icarus Microsystems': { stockSymbol: 'ICRS', serverName: 'icarus' },
  'Universal Energy': { stockSymbol: 'UNV', serverName: 'univ-energy' },
  AeroCorp: { stockSymbol: 'AERO', serverName: 'aerocorp' },
  'Omnia Cybersystems': { stockSymbol: 'OMN', serverName: 'omnia' },
  'Solaris Space Systems': { stockSymbol: 'SLRS', serverName: 'solaris' },
  'Global Pharmaceuticals': { stockSymbol: 'GPH', serverName: 'global-pharm' },
  'Nova Medical': { stockSymbol: 'NVMD', serverName: 'nova-med' },
  'Watchdog Security': { stockSymbol: 'WDS' },
  LexoCorp: { stockSymbol: 'LXO', serverName: 'lexo-corp' },
  'Rho Construction': { stockSymbol: 'RHOC', serverName: 'rho-construction' },
  'Alpha Enterprises': { stockSymbol: 'APHE', serverName: 'alpha-ent' },
  'SysCore Securities': { stockSymbol: 'SYSC', serverName: 'syscore' },
  CompuTek: { stockSymbol: 'CTK', serverName: 'comptek' },
  'NetLink Technologies': { stockSymbol: 'NTLK', serverName: 'netlink' },
  'Omega Software': { stockSymbol: 'OMGA', serverName: 'omega-net' },
  FoodNStuff: { stockSymbol: 'FNS', serverName: 'foodnstuff' },
  'Sigma Cosmetics': { stockSymbol: 'SGC', serverName: 'sigma-cosmetics' },
  "Joe's Guns": { stockSymbol: 'JGN', serverName: 'joesguns' },
  'Catalyst Ventures': { stockSymbol: 'CTYS', serverName: 'catalyst' },
  'Microdyne Technologies': { stockSymbol: 'MDYN', serverName: 'microdyne' },
  'Titan Laboratories': { stockSymbol: 'TITN', serverName: 'titan-labs' },
};

/**
 * @param {string} serverName
 * @returns {string|undefined} stock symbol
 */
export function getStockSymbol(serverName) {
  const organizations = Object.values(ORGANIZATIONS);
  const organization = organizations.find(
    organization => organization.serverName === serverName
  );
  return organization === undefined ? undefined : organization.stockSymbol;
}
