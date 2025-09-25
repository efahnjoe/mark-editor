/**
 * Converts an ISO 8601 date string to a Date object.
 * Returns `undefined` if input is null, undefined, or invalid.
 *
 * @param isoString - The ISO 8601 date string (e.g. "2025-09-09T02:30:00.000Z")
 * @returns A Date object, or undefined if invalid
 *
 * @example
 * parseDate("2025-09-09T02:30:00.000Z") → Date
 * parseDate(undefined) → undefined
 */
export function parseDate(isoString: string | null | undefined): Date | undefined {
  if (!isoString) return undefined;

  const d = new Date(isoString);

  return isNaN(d.getTime()) ? undefined : d; // Check if it is an Invalid Date
}

/**
 * Converts a Date object to an ISO 8601 date string in UTC.
 * Returns `undefined` if input is null or undefined.
 *
 * @param date - The Date object to format
 * @returns An ISO 8601 string (UTC), or undefined if input is invalid
 *
 * @example
 * formatDate(new Date()) → "2025-09-09T02:30:00.000Z"
 * formatDate(undefined) → undefined
 */
export function formatDate(date: Date | null | undefined): string | undefined {
  return date ? date.toISOString() : undefined;
}
