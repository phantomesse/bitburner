import { ONE_SECOND } from 'utils/constants';
import { getDocument } from 'utils/dom';
import { formatMoney } from 'utils/format';
import { getNetWorth } from 'utils/money';

/**
 * Monitors net worth.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const netWorthRowElement = getDocument().createElement('tr');
  netWorthRowElement.className = 'MuiTableRow-root';
  netWorthRowElement.style.display = 'table-row';
  netWorthRowElement.style.color = ns.ui.getTheme().money;
  netWorthRowElement.style.fontFamily = ns.ui.getStyles().fontFamily;
  netWorthRowElement.style.lineHeight = ns.ui.getStyles().lineHeight;
  ns.atExit(() => netWorthRowElement.remove());

  const netWorthHeadingElement = getDocument().createElement('th');
  netWorthHeadingElement.className =
    'MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium';
  netWorthHeadingElement.innerText = 'Net worth';
  netWorthHeadingElement.style.textAlign = 'leftt';
  netWorthHeadingElement.style.display = 'table-cell';
  netWorthHeadingElement.style.fontWeight = 'normal';
  netWorthHeadingElement.style.margin = '0';
  netWorthHeadingElement.style.padding = '0';
  netWorthHeadingElement.style.width = '0';
  netWorthHeadingElement.style.whiteSpace = 'nowrap';
  netWorthHeadingElement.style.overflow = 'hidden';
  netWorthRowElement.style.borderBottom = `1px ${
    ns.ui.getTheme().combat
  } solid`;
  netWorthRowElement.append(netWorthHeadingElement);

  const netWorthValueElement = getDocument().createElement('td');
  netWorthValueElement.className =
    'MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium';
  netWorthValueElement.style.display = 'table-cell';
  netWorthValueElement.style.textAlign = 'right';
  netWorthValueElement.style.margin = '0';
  netWorthValueElement.style.padding = '0';
  netWorthRowElement.append(netWorthValueElement);

  const moneyRowDiv = getDocument().querySelector(
    '.MuiTableRow-root:nth-of-type(2)'
  );
  moneyRowDiv.insertAdjacentElement('afterend', netWorthRowElement);

  while (true) {
    netWorthValueElement.innerText = formatMoney(ns, getNetWorth(ns));
    await ns.sleep(ONE_SECOND);
  }
}
