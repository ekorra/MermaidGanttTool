import type { GanttChart, GanttSection, GanttTask, TaskStatus, DateFormat } from './types'
import { generateId } from '../utils/idUtils'

const DATE_FORMATS: DateFormat[] = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY']
const STATUS_TAGS = new Set(['active', 'done', 'crit', 'milestone'])

/**
 * Parse a Mermaid Gantt syntax string into a GanttChart model.
 * Returns null if the string does not look like a Mermaid Gantt diagram.
 *
 * Only parses what exportToMermaid() produces — round-trip fidelity is the goal,
 * not full Mermaid spec coverage. Unknown directives are silently skipped.
 */
export function parseGantt(syntax: string): GanttChart | null {
  const lines = syntax.split('\n').map(l => l.trim()).filter(Boolean)

  if (lines[0]?.toLowerCase() !== 'gantt') return null

  // Defaults matching createChart()
  let title = 'My Project'
  let dateFormat: DateFormat = 'DD-MM-YYYY'
  let axisFormat = '%b %d'
  let tickInterval: string | null = null
  let excludes: string | null = null
  let todayMarker = true
  let weekday: string | null = null

  const sections: GanttSection[] = []
  let currentSection: GanttSection = { id: generateId('sec'), title: '', tasks: [] }
  // Map of taskId → clickUrl, collected from click directives
  const clickUrls = new Map<string, string>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] ?? ''

    // Header directives
    if (line.startsWith('title ')) { title = line.slice(6).trim(); continue }
    if (line.startsWith('dateFormat ')) {
      const fmt = line.slice(11).trim()
      if ((DATE_FORMATS as string[]).includes(fmt)) dateFormat = fmt as DateFormat
      continue
    }
    if (line.startsWith('axisFormat ')) { axisFormat = line.slice(11).trim(); continue }
    if (line.startsWith('tickInterval ')) { tickInterval = line.slice(13).trim(); continue }
    if (line.startsWith('excludes ')) { excludes = line.slice(9).trim(); continue }
    if (line.startsWith('weekday ')) { weekday = line.slice(8).trim(); continue }
    if (line === 'todayMarker off') { todayMarker = false; continue }
    if (line.startsWith('todayMarker ')) { todayMarker = true; continue }

    // Click directive: click <id> href "<url>"
    if (line.startsWith('click ')) {
      const m = line.match(/^click\s+(\S+)\s+href\s+"([^"]*)"/)
      if (m && m[1] && m[2]) clickUrls.set(m[1], m[2])
      continue
    }

    // Section header
    if (line.startsWith('section ')) {
      if (currentSection.tasks.length > 0 || currentSection.title !== '') {
        sections.push(currentSection)
      }
      currentSection = { id: generateId('sec'), title: line.slice(8).trim(), tasks: [] }
      continue
    }

    // Task line — must contain a colon
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const task = parseTaskLine(line, colonIdx, dateFormat)
    if (task) currentSection.tasks.push(task)
  }

  // Push the last section if it has tasks
  if (currentSection.tasks.length > 0 || sections.length === 0) {
    sections.push(currentSection)
  }

  // Attach click URLs to tasks
  for (const section of sections) {
    for (const task of section.tasks) {
      const url = clickUrls.get(task.id)
      if (url) task.clickUrl = url
    }
  }

  return { title, dateFormat, axisFormat, tickInterval, excludes, todayMarker, weekday, sections }
}

/** Returns true if the string looks like a Mermaid Gantt diagram. */
export function isMermaidGantt(text: string): boolean {
  return text.trimStart().toLowerCase().startsWith('gantt')
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function parseTaskLine(line: string, colonIdx: number, dateFormat: DateFormat): GanttTask | null {
  const label = line.slice(0, colonIdx).trim()
  if (!label) return null

  const tokens = line
    .slice(colonIdx + 1)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  let i = 0

  // Collect leading status tags
  const tags: string[] = []
  while (i < tokens.length && STATUS_TAGS.has(tokens[i] ?? '')) {
    tags.push(tokens[i]!)
    i++
  }

  // Next non-status token that isn't a date, duration, or "after ..." is the task ID
  const idToken = tokens[i] ?? ''
  const isDate = looksLikeDate(idToken, dateFormat)
  const isDuration = /^\d+[dwh]$/.test(idToken)
  const isAfter = idToken.startsWith('after ')
  const id = (!isDate && !isDuration && !isAfter && idToken)
    ? (i++, idToken)
    : generateId('task')

  // Start field: date or "after id1 id2 ..."
  let startDate: string | null = null
  let afterTaskIds: string[] = []
  const startToken = tokens[i++] ?? ''
  if (startToken.startsWith('after ')) {
    afterTaskIds = startToken.slice(6).trim().split(/\s+/).filter(Boolean)
  } else {
    startDate = fromMermaidDate(startToken, dateFormat)
  }

  // End field: date, duration, or 0d (milestone — ignore)
  let endDate: string | null = null
  let duration: string | null = null
  const endToken = tokens[i] ?? ''
  if (endToken && endToken !== '0d') {
    if (/^\d+[dwh]$/.test(endToken)) {
      duration = endToken
    } else {
      endDate = fromMermaidDate(endToken, dateFormat)
    }
  }

  // Resolve status
  let status: TaskStatus | null = null
  if (tags.includes('crit') && tags.includes('active')) status = 'crit+active'
  else if (tags.includes('crit') && tags.includes('done')) status = 'crit+done'
  else if (tags.includes('milestone')) status = 'milestone'
  else if (tags.includes('active')) status = 'active'
  else if (tags.includes('done')) status = 'done'
  else if (tags.includes('crit')) status = 'crit'

  return { id, label, status, startDate, endDate, duration, afterTaskIds, clickUrl: null, color: null }
}

/**
 * Convert a date string from the chart's dateFormat back to ISO (YYYY-MM-DD).
 * Returns null if the string cannot be parsed.
 */
function fromMermaidDate(dateStr: string, dateFormat: DateFormat): string | null {
  if (!dateStr) return null
  let year: string | undefined, month: string | undefined, day: string | undefined

  switch (dateFormat) {
    case 'YYYY-MM-DD': { const p = dateStr.split('-'); [year, month, day] = p; break }
    case 'MM/DD/YYYY': { const p = dateStr.split('/'); [month, day, year] = p; break }
    case 'DD-MM-YYYY': { const p = dateStr.split('-'); [day, month, year] = p; break }
    case 'DD/MM/YYYY': { const p = dateStr.split('/'); [day, month, year] = p; break }
  }
  if (!year || !month || !day) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function looksLikeDate(token: string, dateFormat: DateFormat): boolean {
  switch (dateFormat) {
    case 'YYYY-MM-DD': return /^\d{4}-\d{2}-\d{2}$/.test(token)
    case 'MM/DD/YYYY': return /^\d{2}\/\d{2}\/\d{4}$/.test(token)
    case 'DD-MM-YYYY': return /^\d{2}-\d{2}-\d{4}$/.test(token)
    case 'DD/MM/YYYY': return /^\d{2}\/\d{2}\/\d{4}$/.test(token)
  }
}
