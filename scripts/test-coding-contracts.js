import { CODING_CONTRACT_TYPE_TO_SOLVER_MAP } from 'utils/coding-contracts';
import { Table, Cell, tprintTable, LEFT_ALIGN_STYLES } from 'utils/table';

const TEST_CASE_COUNT = 5;

/**
 * Generates test contracts for a given contract type and attempts to solve
 * them.
 *
 * Usage: `run test-coding-contracts.js <codingContractType>`
 *
 * If no contract type is passed in, test all the contracts that we have solvers
 * for.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const codingContractType = ns.args[0];
  if (ns.codingcontract.getContractTypes().includes(codingContractType)) {
    // Test the given contract.
    testContractType(ns, codingContractType);
    return;
  }

  // Test all contracts that we have solvers for.
  for (const codingContractType in CODING_CONTRACT_TYPE_TO_SOLVER_MAP) {
    if (!CODING_CONTRACT_TYPE_TO_SOLVER_MAP[codingContractType]) continue;

    ns.tprintf('\n\n' + codingContractType);
    testContractType(ns, codingContractType);
  }
}

/**
 * @param {NS} ns
 * @param {string} codingContractType
 */
function testContractType(ns, codingContractType) {
  const table = new Table();
  for (let i = 0; i < TEST_CASE_COUNT; i++) {
    const fileName = ns.codingcontract.createDummyContract(codingContractType);
    table.cells.push({
      columnName: 'File Name',
      rowId: fileName,
      content: fileName,
      columnStyles: LEFT_ALIGN_STYLES,
    });

    const input = ns.codingcontract.getData(fileName);
    table.cells.push({
      columnName: 'Input',
      rowId: fileName,
      content: `${input}`,
      columnStyles: { ...LEFT_ALIGN_STYLES, width: '200px' },
    });

    const solver = CODING_CONTRACT_TYPE_TO_SOLVER_MAP[codingContractType];
    /** @type {Cell} */ const outputCell = {
      columnName: 'Output',
      rowId: fileName,
      columnStyles: { ...LEFT_ALIGN_STYLES, width: '200px' },
    };
    if (solver) {
      const answer = solver(input);
      const reward = ns.codingcontract.attempt(answer, fileName);
      if (reward) {
        outputCell.content = `✅ ${answer}`;
        outputCell.cellStyles = { color: ns.ui.getTheme().success };
      } else {
        outputCell.content = `❌ ${answer}`;
        outputCell.cellStyles = { color: ns.ui.getTheme().error };
      }
    } else {
      outputCell.content = 'No solver available';
      outputCell.cellStyles = { color: ns.ui.getTheme().warning };
    }
    table.cells.push(outputCell);
  }

  tprintTable(ns, table);
}

export const autocomplete = (data) =>
  Object.keys(CODING_CONTRACT_TYPE_TO_SOLVER_MAP).map(
    (contractName) => `"${contractName}"`
  );
