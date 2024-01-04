import findLargestPrimeFactor from 'contracts/find-largest-prime-factor';
import sanitizeParenthesesInExpression from 'contracts/sanitize-parentheses-in-expression';
import totalWaysToSum from 'contracts/total-ways-to-sum';
import uniquePathsInAGridI from 'contracts/unique-paths-in-a-grid-i.old';
import { getServers } from 'database/servers';
import { getPath } from 'utils';
import { CONTRACT_TYPE_TO_SOLVER_MAP } from 'utils/constants';

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
      if (
        contractType in CONTRACT_TYPE_TO_SOLVER_MAP &&
        CONTRACT_TYPE_TO_SOLVER_MAP[contractType] !== null
      ) {
        const wasSuccessful = ns.codingcontract.attempt(
          CONTRACT_TYPE_TO_SOLVER_MAP[contractType](
            ns.codingcontract.getData(contract, server.hostname)
          ),
          contract,
          server.hostname
        );
        if (wasSuccessful) {
          ns.tprint(
            `SUCCESS Solved ${contract} on ${server.hostname} (${contractType})`
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
