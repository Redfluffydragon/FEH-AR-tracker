
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