/**
 * Timezone utilities for user operations.
 * The user's operational timezone is Pakistan Standard Time (PKT, UTC+5, Asia/Karachi).
 * Since Vercel serverless functions run in UTC (process.env.TZ = "UTC"), these helpers
 * ensure consistent day boundaries and prevent timezone offset bugs.
 */

export const PKT_OFFSET_HOURS = 5;
export const PKT_OFFSET_MS = PKT_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Returns a "YYYY-MM-DD" date key based on PKT (UTC+5).
 */
export function getPktDateKey(date: Date = new Date()): string {
  const pktDate = new Date(date.getTime() + PKT_OFFSET_MS);
  return pktDate.toISOString().slice(0, 10);
}

/**
 * Returns a UTC Date representing 00:00:00.000 PKT for the given date.
 * (e.g. for 2026-11-11 PKT, returns 2026-11-10T19:00:00.000Z in UTC)
 */
export function getPktStartOfDay(date: Date = new Date()): Date {
  const pktDate = new Date(date.getTime() + PKT_OFFSET_MS);
  pktDate.setUTCHours(0, 0, 0, 0);
  return new Date(pktDate.getTime() - PKT_OFFSET_MS);
}

/**
 * Returns a UTC Date representing 23:59:59.999 PKT for the given date.
 * (e.g. for 2026-11-11 PKT, returns 2026-11-11T18:59:59.999Z in UTC)
 */
export function getPktEndOfDay(date: Date = new Date()): Date {
  const pktDate = new Date(date.getTime() + PKT_OFFSET_MS);
  pktDate.setUTCHours(23, 59, 59, 999);
  return new Date(pktDate.getTime() - PKT_OFFSET_MS);
}

/**
 * Checks whether two dates fall on the same calendar day in PKT.
 */
export function isSamePktDay(dateA: Date | string, dateB: Date | string = new Date()): boolean {
  const dA = typeof dateA === "string" ? new Date(dateA) : dateA;
  const dB = typeof dateB === "string" ? new Date(dateB) : dateB;
  return getPktDateKey(dA) === getPktDateKey(dB);
}
