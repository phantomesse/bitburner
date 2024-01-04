import { sanitizeParenthesesInExpression } from 'contracts/sanitize-parentheses-in-expression';
import { totalWaysToSum } from 'contracts/total-ways-to-sum';
import { getServers } from 'database/servers';
import { getPath } from 'utils';

const CONTRACT_TYPE_TO_SOLVE_FUNCTION_MAP = {
  'Total Ways to Sum': totalWaysToSum,
  'Sanitize Parentheses in Expression': sanitizeParenthesesInExpression,
};

/**
 * Manages contracts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getServers(ns);
  for (const server of servers) {
    const contracts = ns.ls(server.hostname, '.cct');
    for (const contract of contracts) {
      const contractType = ns.codingcontract.getContractType(
        contract,
        server.hostname
      );
      if (contractType in CONTRACT_TYPE_TO_SOLVE_FUNCTION_MAP) {
        const wasSuccessful = ns.codingcontract.attempt(
          CONTRACT_TYPE_TO_SOLVE_FUNCTION_MAP[contractType](
            ns.codingcontract.getData(contract, server.hostname)
          ),
          contract,
          server.hostname
        );
        if (wasSuccessful) {
          ns.tprint(
            `Solved ${contract} on ${server.hostname} (${contractType})`
          );
          continue;
        } else {
          ns.tprint(`Could not solve ${contractType}`);
        }
      }

      ns.tprint(ns.codingcontract.getContractType(contract, server.hostname));
      ns.tprintf(
        'home; ' +
          getPath(ns, server.hostname)
            .map(hostname => `connect ${hostname};`)
            .join(' ') +
          ` run ${contract}`
      );
    }
  }
}
