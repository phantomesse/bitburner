import { HOME_HOSTNAME, CONTRACT_TYPE_TO_SOLVER_MAP } from 'utils/constants';
import { createReactElement } from 'utils/dom';
import { tprintTable } from 'utils/table';

const NUM_CONTRACTS_TO_GENERATE = 5;

/**
 * Generates contracts to test a contract function again.
 *
 * Takes in a contract type as an argument.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const contractType = ns.args[0];

  ns.tprintf(`Testing ${contractType}`);

  // Generate contracts.
  for (let i = 0; i < NUM_CONTRACTS_TO_GENERATE; i++) {
    ns.codingcontract.createDummyContract(contractType);
  }

  // Get generated contract file names.
  const contractFileNames = ns
    .ls(HOME_HOSTNAME, '.cct')
    .filter(
      contractFileName =>
        ns.codingcontract.getContractType(contractFileName) === contractType
    );

  // Get contract solver.
  const solver = CONTRACT_TYPE_TO_SOLVER_MAP[contractType];

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (const contractFileName of contractFileNames) {
    // Try to solve the contract.
    const input = ns.codingcontract.getData(contractFileName);
    const startTimestamp = new Date().getUTCMilliseconds();
    const output = solver(input);
    const endTimestamp = new Date().getUTCMilliseconds();
    const wasSuccessful =
      ns.codingcontract.attempt(output, contractFileName).length > 0;

    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Contract Name', style: {} },
          content: contractFileName,
        },
        {
          column: { name: 'Input', style: { maxWidth: '200px' } },
          content: `${input}`,
        },
        {
          column: { name: 'Output', style: {} },
          content: `${output}`,
        },
        {
          column: { name: 'Success?', style: {} },
          content: createReactElement(
            wasSuccessful ? 'Success!' : 'Failed 😭',
            {
              color: wasSuccessful
                ? ns.ui.getTheme().success
                : ns.ui.getTheme().error,
            }
          ),
        },
        {
          column: { name: 'Time', style: { textAlign: 'center' } },
          content: `${endTimestamp - startTimestamp}ms`,
        },
      ],
    };
    table.rows.push(row);
  }
  tprintTable(ns, table);
}

export function autocomplete() {
  return Object.keys(CONTRACT_TYPE_TO_SOLVER_MAP)
    .filter(contractType => CONTRACT_TYPE_TO_SOLVER_MAP[contractType] !== null)
    .map(contractType => `"${contractType}"`);
}
