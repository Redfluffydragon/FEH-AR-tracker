import { get } from "svelte/store";

/**
 * Get the end date of the current season
 * @returns A date object
 */
export function getEndDate() {
  const now = new Date();
  const seasonEndDate = new Date();
  seasonEndDate.setDate(now.getDate() + (7 + 1 - now.getDay()) % 7);
  seasonEndDate.setHours(17, 0, 0); // have to correct for daylight saving time
  return seasonEndDate;
}

/**
 * Get the number of defenses it is possible to lose based on the current time and the time of the last defense that counted
 * @param {Date} lastDefenseDate 
 * @param {Boolean} round Whether or not to round the number returned
 * @returns Number
 */
export function getDefensesCanLose(lastDefenseDate, round = true) {
  lastDefenseDate = new Date(lastDefenseDate);
  const now = new Date();
  const LLCTimeLeft = lastDefenseDate === null ? 0 : lastDefenseDate.valueOf() + 7.2e+7 - now;
  const correctLLCTimeLeft = Math.max(LLCTimeLeft, 0);
  if (round === true) {
    return Math.ceil((getEndDate().valueOf() - now - correctLLCTimeLeft) / 20 / 3600000);
  }
  return (getEndDate().valueOf() - now - correctLLCTimeLeft) / 20 / 3600000;
}

export function getTimeToFewerDefenses(lastDefenseDate) {
  lastDefenseDate = new Date(lastDefenseDate);
  if (getDefensesCanLose(lastDefenseDate) <= 0) {
    return 'N/A';
  }
  const defensesCanLoseUnround = getDefensesCanLose(lastDefenseDate, false);
  // get rid of ms to prevent flickering when out of sync with LLC time left calculation
  const msTilFewer = Math.trunc((defensesCanLoseUnround - Math.trunc(defensesCanLoseUnround)) * 20 * 3.6e+6 / 1000) * 1000;
  return parseTime(msTilFewer + getLLCTimeLeft(lastDefenseDate));
}

export function getLLCTimeLeft(lastDefenseDate, preParse = false) {
  //pre-parse for display, leave as milliseconds for further calculations
  if (lastDefenseDate === null) {
    return 0;
  }
  lastDefenseDate = new Date(lastDefenseDate);
  const now = new Date();
  const LLCTimeLeft = (lastDefenseDate.valueOf() + 7.2e+7 - now);
  return preParse ? parseTime(Math.max(LLCTimeLeft, 0)) : Math.max(LLCTimeLeft, 0);
}

/**
 * Take a duration in milliseconds and convert it to hh:mm:ss format
 * @param {A duration in milliseconds} milliseconds 
 * @returns A time string
 */
export function parseTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = ('0' + Math.floor((milliseconds % 3600000) / 60000)).slice(-2);
  const seconds = ('0' + Math.floor((milliseconds % 60000) / 1000)).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Convert a time in milliseconds to a human-readable string
 * @param {*} milliseconds 
 * @returns A date string
 */
export function parseDate(milliseconds) {
  const msToDate = new Date(milliseconds);
  return `${msToDate.getMonth() + 1}/${msToDate.getDate()}/${msToDate.getFullYear()} ${msToDate.toTimeString().slice(0, 5)}`;
}

/**
 * Get an item from localStorage or sessionStorage, and if it doesn't exist, set it to the default
 * @param {string} key The storage key for the item
 * @param {*} value The default value to be set if the store does not exist yet
 * @param {(localStorage | sessionStorage)} [type] Local or session storage
 * @returns The item from storage, or the default if there was nothing set
 */
export function gotEm(key, value, type = localStorage) {
  const getthething = type.getItem(key);

  if (getthething == null) { // Nothing set yet
    type.setItem(key, JSON.stringify(value));
    return value;
  }

  // For in case it got set to something not in JSON format
  try {
    return JSON.parse(getthething);
  }
  catch {
    type.setItem(key, JSON.stringify(value));
    return value;
  }
};