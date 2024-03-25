import { getAllServers } from 'utils/servers';
import { tprintTable } from 'utils/table';

/**
 * Find and solve contracts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getAllServers(ns);

  // Get all contracts.
  /** @type {Contract[]} */ const contracts = [];
  for (const server of servers) {
    const contractFiles = ns.ls(server.hostname, '.cct');
    contracts.push(
      ...contractFiles.map(fileName => ({
        fileName,
        hostname: server.hostname,
        path: server.path,
      }))
    );
  }

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (const contract of contracts) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Contract Type' },
          content: ns.codingcontract.getContractType(
            contract.fileName,
            contract.hostname
          ),
        },
        {
          column: { name: 'Run Command', style: { width: '50vw' } },
          content: [
            'home',
            ...contract.path.map(hostname => `connect ${hostname}`),
            `run ${contract.fileName}`,
          ].join('; '),
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
 * @property {string} hostname
 * @property {string[]} path to the server containing the contract
 */
