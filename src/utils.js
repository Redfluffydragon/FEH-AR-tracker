
/**
 * Get the end date of the current season
 */
 export function getEndDate() {
  const now = new Date();
  const seasonEndDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
  
  seasonEndDate.setUTCDate(now.getUTCDate() + (7 + 1 - now.getUTCDay()) % 7);
  seasonEndDate.setUTCHours(23, 0, 0, 0);
  return seasonEndDate.valueOf();
}

/**
   * Take a duration in milliseconds and convert it to hh:mm:ss format
   * @param {A duration in milliseconds} milliseconds
   * @returns A time string
   */
export function parseTime(milliseconds, array = false, plus1 = false) {
  if (milliseconds == null) {
    if (!array) {
      return '--:--:--';
    }
    return ['--', '--', '--'];
  }
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = ('0' + Math.floor((milliseconds % 3600000) / 60000)).slice(-2);
  // Plus one on some of them to make it look right
  let seconds = ('0' + (Math.floor((milliseconds % 60000) / 1000) + (plus1 ? 1 : 0))).slice(-2);
  // Otherwise with +1 it's 60 for a second
  if (seconds === '60') {
    seconds = '00';
  }
  if (!array) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return [hours, minutes, seconds];
}