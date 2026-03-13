/**
 * Parse a Mermaid duration string to a number of whole days.
 * Supported units: d (days), w (weeks), h (hours), m (minutes).
 * Falls back to 1 day for unrecognized formats.
 */
export function parseDurationDays(duration: string): number {
  const match = duration.match(/^(\d+(?:\.\d+)?)(d|w|h|m)$/i)
  if (!match) return 1
  const num = parseFloat(match[1]!)
  switch (match[2]!.toLowerCase()) {
    case 'd': return Math.max(1, Math.ceil(num))
    case 'w': return Math.max(1, Math.ceil(num * 7))
    case 'h': return Math.max(1, Math.ceil(num / 24))
    case 'm': return 1
    default:  return 1
  }
}
