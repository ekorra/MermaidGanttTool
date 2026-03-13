/**
 * Pure date arithmetic utilities. No external dependencies.
 * All functions operate on ISO date strings (YYYY-MM-DD) or Date objects.
 */

/** Parse an ISO date string to a Date at midnight UTC. */
export function parseDate(iso: string): Date {
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3) throw new Error(`Invalid ISO date string: "${iso}"`)
  const [year, month, day] = parts
  if (year === undefined || month === undefined || day === undefined ||
      isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid ISO date string: "${iso}"`)
  }
  const date = new Date(Date.UTC(year, month - 1, day))
  if (isNaN(date.getTime())) throw new Error(`Invalid ISO date string: "${iso}"`)
  return date
}

/** Format a Date to an ISO date string (YYYY-MM-DD). */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Return a new date offset by the given number of days (positive or negative). */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

/**
 * Return the number of whole days between two dates.
 * Positive when end is after start.
 */
export function diffDays(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((end.getTime() - start.getTime()) / msPerDay)
}

/** Return the earlier of two dates. */
export function minDate(a: Date, b: Date): Date {
  return a <= b ? a : b
}

/** Return the later of two dates. */
export function maxDate(a: Date, b: Date): Date {
  return a >= b ? a : b
}
