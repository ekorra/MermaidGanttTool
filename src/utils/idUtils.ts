/**
 * Generates a short unique ID with the given prefix.
 * Uses crypto.randomUUID() for uniqueness, taking only the first 8 hex chars.
 * Result contains only alphanumeric characters — safe as a Mermaid task ID.
 *
 * @example generateId('task') → 'task_a3f2c1d0'
 */
export function generateId(prefix: string): string {
  const uuid = crypto.randomUUID().replace(/-/g, '')
  return `${prefix}_${uuid.slice(0, 8)}`
}
