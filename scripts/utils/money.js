import { HOME_SERVER_NAME } from 'utils/server';

const PERCENT_OF_MONEY_TO_SAVE = 0.5;

/**
 * @param {NS} ns
 * @returns {number} amount available to spend with savings accounted for
 */
export function getMoneyAvailableToSpend(ns) {
  return (
    ns.getServerMoneyAvailable(HOME_SERVER_NAME) *
    (1 - PERCENT_OF_MONEY_TO_SAVE)
  );
}
