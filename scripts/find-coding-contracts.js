import { CODING_CONTRACT_TYPE_TO_SOLVER_MAP } from 'utils/coding-contracts';
import { getAllServerNames, getPath, HOME_SERVER_NAME } from 'utils/server';
import { LEFT_ALIGN_STYLES, Table, tprintTable } from 'utils/table';

/** @param {NS} ns */
export async function main(ns) {
  const allServerNames = getAllServerNames(ns);

  const table = new Table();
  for (const serverName of allServerNames) {
    const codingContractFileNames = ns
      .ls(serverName)
      .filter((fileName) => fileName.endsWith('.cct'));
    const path = getPath(ns, HOME_SERVER_NAME, serverName);

    for (const codingContractFileName of codingContractFileNames) {
      const codingContractType = ns.codingcontract.getContractType(
        codingContractFileName,
        serverName
      );
      table.cells.push({
        columnName: 'Contract Type',
        rowId: codingContractFileName,
        content: codingContractType,
        value: codingContractType,
        columnStyles: LEFT_ALIGN_STYLES,
      });

      const openCodingContractTerminalCommand = [
        'home',
        ...path.map((pathServerName) => `connect ${pathServerName}`),
        `run ${codingContractFileName}`,
      ].join('; ');
      table.cells.push({
        columnName: 'Run Command',
        rowId: codingContractFileName,
        content: openCodingContractTerminalCommand,
        columnStyles: {
          ...LEFT_ALIGN_STYLES,
          width: '200px',
        },
      });

      const input = ns.codingcontract.getData(
        codingContractFileName,
        serverName
      );
      table.cells.push({
        columnName: 'Input',
        rowId: codingContractFileName,
        content: `${input}`,
        columnStyles: {
          ...LEFT_ALIGN_STYLES,
          width: '200px',
        },
      });

      const solver = CODING_CONTRACT_TYPE_TO_SOLVER_MAP[codingContractType];
      /** @type {Cell} */ const outputCell = {
        columnName: 'Output',
        rowId: codingContractFileName,
        columnStyles: LEFT_ALIGN_STYLES,
      };
      if (solver) {
        const answer = solver(input);
        if (answer === null) {
          outputCell.content = 'No solver available';
          outputCell.cellStyles = { color: ns.ui.getTheme().warning };
        } else {
          const reward = ns.codingcontract.attempt(
            answer,
            codingContractFileName,
            serverName
          );
          if (reward) {
            outputCell.content = `✅ ${reward}`;
            outputCell.cellStyles = { color: ns.ui.getTheme().success };
          } else {
            outputCell.content = `❌ ${answer}`;
            outputCell.cellStyles = { color: ns.ui.getTheme().error };
          }
        }
      } else {
        outputCell.content = 'No solver available';
        outputCell.cellStyles = { color: ns.ui.getTheme().warning };
      }
      table.cells.push(outputCell);
    }
  }

  tprintTable(ns, table);
}
