import { getServers } from 'database/servers';
import { CONTRACT_TYPE_TO_SOLVER_MAP, HOME_HOSTNAME } from 'utils/constants';
import { createReactElement } from 'utils/dom';
import { tprintTable } from 'utils/table';

/**
 * Manages contracts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getServers(ns);

  /** @type {Contract[]} */ const contracts = servers
    .map(server =>
      ns.ls(server.hostname, '.cct').map(
        fileName =>
          /** @type {Contract} */ ({
            fileName,
            type: ns.codingcontract.getContractType(fileName, server.hostname),
            server,
          })
      )
    )
    .flat();
  contracts.sort((a, b) => a.type.localeCompare(b.type));

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (const contract of contracts) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Contract Type', style: {} },
          content: contract.type,
        },
        {
          column: { name: 'Status', style: {} },
          content: attemptContract(ns, contract),
        },
        {
          column: { name: 'Run Command', style: { maxWidth: '800px' } },
          content: getRunCommand(contract),
        },
      ],
    };
    table.rows.push(row);
  }
  tprintTable(ns, table);
}
/**
 * @typedef Contract
 * @property {string} fileName
 * @property {string} type
 * @property {Server} server
 */

/**
 * @param {NS} ns
 * @param {Contract} connect
 * @returns {import('NetscriptDefinitions').ReactElement} message representing the status of attempting the contract
 */
function attemptContract(ns, contract) {
  const theme = ns.ui.getTheme();
  if (
    !(contract.type in CONTRACT_TYPE_TO_SOLVER_MAP) ||
    CONTRACT_TYPE_TO_SOLVER_MAP[contract.type] === null
  ) {
    return createReactElement('No solver available', { color: theme.warning });
  }

  const data = ns.codingcontract.getData(
    contract.fileName,
    contract.server.hostname
  );
  const solver = CONTRACT_TYPE_TO_SOLVER_MAP[contract.type];
  const answer = solver(data);
  const reward = ns.codingcontract.attempt(
    answer,
    contract.fileName,
    contract.server.hostname
  );
  return reward
    ? createReactElement(reward, { color: theme.success })
    : createReactElement('Attempt failed!', { color: theme.error });
}

/**
 * @param {Contract} contract
 * @returns {string} run command
 */
function getRunCommand(contract) {
  return [
    'home',
    ...contract.server.path.map(hostname => `connect ${hostname}`),
    `run ${contract.fileName}`,
  ].join('; ');
}
