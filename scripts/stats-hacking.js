import { formatMoney, getAllHostnames, createReactElement } from 'utils';

/** @type {Style} */ const CELL_STYLING = {
  padding: '2px 8px',
  borderWidth: '.5px',
  borderStyle: 'solid',
};

/**
 * @typedef Column
 * @property {string} name
 * @property {import('utils').Style} style
 * @property {'⏶'|'⏷'} sortSymbol
 * @property {function(NS, string string):number} sortFunction
 */

/** @type {Column} */ const HOSTNAME_COLUMN = {
  name: 'Hostname',
  style: {},
  sortSymbol: '⏷',
  sortFunction: (_, hostname1, hostname2) => hostname1.localeCompare(hostname2),
};

/** @type {Column} */ const AVAILABLE_MONEY_COLUMN = {
  name: 'Available Money',
  style: { textAlign: 'right' },
  sortSymbol: '⏷',
  sortFunction: (ns, hostname1, hostname2) => {
    return (
      ns.getServerMoneyAvailable(hostname2) -
      ns.getServerMoneyAvailable(hostname1)
    );
  },
};

/** @type {Column} */ const MAX_MONEY_COLUMN = {
  name: 'Max Money',
  style: { textAlign: 'right' },
  sortSymbol: '⏷',
  sortFunction: (ns, hostname1, hostname2) => {
    return ns.getServerMaxMoney(hostname2) - ns.getServerMaxMoney(hostname1);
  },
};

/** @type {Column} */ const CURRENT_SECURITY_COLUMN = {
  name: 'Current Security',
  style: { textAlign: 'right' },
  sortSymbol: '⏶',
  sortFunction: (ns, hostname1, hostname2) => {
    return (
      ns.getServerSecurityLevel(hostname1) -
      ns.getServerSecurityLevel(hostname2)
    );
  },
};

/** @type {Column} */ const MIN_SECURITY_COLUMN = {
  name: 'Min Security',
  style: { textAlign: 'right' },
  sortSymbol: '⏶',
  sortFunction: (ns, hostname1, hostname2) => {
    return (
      ns.getServerMinSecurityLevel(hostname1) -
      ns.getServerMinSecurityLevel(hostname2)
    );
  },
};

/** @type {Column} */ const BASE_SECURITY_COLUMN = {
  name: 'Base Security',
  style: { textAlign: 'right' },
  sortSymbol: '⏶',
  sortFunction: (ns, hostname1, hostname2) => {
    return (
      ns.getServerBaseSecurityLevel(hostname1) -
      ns.getServerBaseSecurityLevel(hostname2)
    );
  },
};

/** @type {Column} */ const HACKING_LEVEL_COLUMN = {
  name: 'Hacking Level',
  style: { textAlign: 'right' },
  sortSymbol: '⏶',
  sortFunction: (ns, hostname1, hostname2) => {
    return (
      ns.getServerRequiredHackingLevel(hostname1) -
      ns.getServerRequiredHackingLevel(hostname2)
    );
  },
};

const COLUMNS = [
  HOSTNAME_COLUMN,
  AVAILABLE_MONEY_COLUMN,
  MAX_MONEY_COLUMN,
  CURRENT_SECURITY_COLUMN,
  MIN_SECURITY_COLUMN,
  BASE_SECURITY_COLUMN,
  HACKING_LEVEL_COLUMN,
];

/**
 * List out the stats of all servers.
 *
 * Add an argument without spaces for sorting by that column. For example, to
 * sort by hacking level, run: `run server-stats.js hackinglevel`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  let primaryColor = ns.ui.getTheme().primary.substring(1);
  if (primaryColor.length === 3) {
    const colors = primaryColor.split('');
    primaryColor =
      colors[0] + colors[0] + colors[1] + colors[1] + colors[2] + colors[2];
  }
  CELL_STYLING.borderColor = `#${primaryColor}33`;

  const hostnames = getAllHostnames(ns);

  // Sort hostnames.
  let sortByColumn = HOSTNAME_COLUMN;
  if (ns.args[0]) {
    const column = COLUMNS.find(
      column =>
        column.name.replaceAll(' ', '').toLowerCase() ===
        ns.args[0].toLowerCase()
    );
    if (column) sortByColumn = column;
  }
  hostnames.sort((hostname1, hostname2) =>
    sortByColumn.sortFunction(ns, hostname1, hostname2)
  );

  const serverStats = hostnames.map(hostname => getServerStats(ns, hostname));

  // Add in a row for the header.
  const cells = Object.keys(serverStats[0]).map(columnName => {
    const column = COLUMNS.find(column => column.name === columnName);
    return createReactElement(
      columnName + (column === sortByColumn ? ' ' + column.sortSymbol : ''),
      {
        ...column.style,
        ...CELL_STYLING,
        fontWeight: 'bold',
      }
    );
  });

  // Add in a row for each server.
  for (const stats of serverStats) {
    cells.push(...Object.values(stats));
  }

  ns.tprintRaw(
    React.createElement(
      'div',
      {
        style: {
          border: `.5px ${CELL_STYLING.borderColor} solid`,
          display: 'grid',
          gridTemplateColumns: Object.keys(serverStats[0])
            .map(_ => '1fr')
            .join(' '),
        },
      },
      ...cells
    )
  );
}

/**
 * @param {NS} ns
 * @param {string} hostname
 * @returns {Object.<string, import('../NetscriptDefinitions').ReactElement>} stats
 */
function getServerStats(ns, hostname) {
  const stats = {};

  /**
   * @param {Column} column
   * @param {import('../NetscriptDefinitions').ReactNode} content
   * @param {import('utils').Style} style additional styling
   */
  const addStat = (column, content, style) => {
    stats[column.name] = createReactElement(content, {
      ...CELL_STYLING,
      ...column.style,
    });
  };

  addStat(HOSTNAME_COLUMN, hostname);

  // Money stats.
  const maxMoneyAmount = ns.getServerMaxMoney(hostname);
  addStat(
    AVAILABLE_MONEY_COLUMN,
    maxMoneyAmount === 0
      ? '-'
      : formatMoney(ns, ns.getServerMoneyAvailable(hostname))
  );
  addStat(
    MAX_MONEY_COLUMN,
    maxMoneyAmount === 0 ? '-' : formatMoney(ns, maxMoneyAmount)
  );

  // Security stats.
  addStat(
    CURRENT_SECURITY_COLUMN,
    ns.formatNumber(ns.getServerSecurityLevel(hostname), 2)
  );
  addStat(MIN_SECURITY_COLUMN, ns.getServerMinSecurityLevel(hostname));
  addStat(BASE_SECURITY_COLUMN, ns.getServerBaseSecurityLevel(hostname));

  // Hacking stats.
  addStat(HACKING_LEVEL_COLUMN, ns.getServerRequiredHackingLevel(hostname));

  return stats;
}
