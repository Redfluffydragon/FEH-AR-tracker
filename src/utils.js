
/**
 * Get the end date of the current season
 */
 export function getEndDate() {
  const now = new Date();
  const seasonEndDate = new Date();
  seasonEndDate.setDate(now.getDate() + (7 + 1 - now.getDay()) % 7);
  seasonEndDate.setHours(17, 0, 0, 0); // have to correct for daylight saving time?
  return seasonEndDate;
}