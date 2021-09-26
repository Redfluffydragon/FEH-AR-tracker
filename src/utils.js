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
export function getDefensesCanLose(lastDefenseDate, forDisplay = true) {
  lastDefenseDate = new Date(lastDefenseDate);

  const now = new Date();
  const LLCTimeLeft = Math.max((lastDefenseDate ? lastDefenseDate.valueOf() + 7.2e+7 - now : 0), 0);
  const defensesCanLose = (getEndDate().valueOf() - now - LLCTimeLeft);

  // Subtract one when not-for-display just so it matches LLC time left - don't know why it's like this (modulus probably)
  return forDisplay ? Math.ceil(defensesCanLose / 7.2e7) : defensesCanLose % 7.2e7 - 1;
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