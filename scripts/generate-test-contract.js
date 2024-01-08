import { createReactElement } from 'utils/dom';
import { CONTRACT_TYPE_TO_SOLVER_MAP, HOME_HOSTNAME } from 'utils/constants';

const PADDING = '16px';

/**
 * Generates test contracts.
 *
 * Takes in a contract type as an argument.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const contractType = ns.args[0];

  // Check if there is an existing test contract that we can run.
  let contractFileName = getDummyContract(ns, contractType);
  if (!contractFileName) {
    ns.codingcontract.createDummyContract(contractType);
    contractFileName = getDummyContract(ns, contractType);
  }

  // Print out the contract into --tail logs.
  printContract(ns, contractFileName);
}

export function autocomplete() {
  return Object.keys(CONTRACT_TYPE_TO_SOLVER_MAP).map(
    contractType => `"${contractType}"`
  );
}

/**
 * Returns a dummy contract's file name if it exists and undefined if otherwise.
 *
 * @param {NS} ns
 * @param {string} contractType
 * @returns {string|undefined} contract file name
 */
function getDummyContract(ns, contractType) {
  return ns
    .ls(HOME_HOSTNAME, '.cct')
    .find(
      contractFileName =>
        ns.codingcontract.getContractType(contractFileName) === contractType
    );
}

/**
 * Prints a contract to terminal given the contract file name.
 *
 * @param {NS} ns
 * @param {string} contractFileName
 */
function printContract(ns, contractFileName) {
  const color = ns.ui.getTheme().success;

  // Print contract type.
  ns.tprintRaw(
    createReactElement(ns.codingcontract.getContractType(contractFileName), {
      color: color,
      fontWeight: 'bold',
      padding: PADDING,
    })
  );

  // Print description.
  ns.tprintRaw(
    createReactElement(ns.codingcontract.getDescription(contractFileName), {
      padding: PADDING,
    })
  );

  // Print command to attempt.
  ns.tprintRaw(
    createReactElement(`home; run ${contractFileName}`, {
      color: color,
      padding: PADDING,
    })
  );
}
