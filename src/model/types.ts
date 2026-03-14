// ─── Task ────────────────────────────────────────────────────────────────────

/**
 * Visual/semantic status of a task, maps directly to Mermaid Gantt status tags.
 * null means a plain task with no status tag.
 * crit+active / crit+done emit two tags: "crit, active" / "crit, done".
 */
export type TaskStatus = 'active' | 'done' | 'crit' | 'crit+active' | 'crit+done' | 'milestone'

/**
 * Date format tokens supported by Mermaid Gantt diagrams.
 */
export type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD-MM-YYYY'

export interface GanttTask {
  /** Unique identifier within the chart. Must not contain whitespace (Mermaid constraint). */
  id: string
  /** Human-readable label displayed on the task bar. */
  label: string
  /** Status tag. null = plain task, no tag emitted. */
  status: TaskStatus | null
  /**
   * ISO date string for the task start date.
   * Ignored on export when afterTaskIds is non-empty.
   */
  startDate: string | null
  /**
   * ISO date string for the task end date.
   * Mutually exclusive with duration — endDate takes priority on export.
   */
  endDate: string | null
  /**
   * Mermaid duration string, e.g. "3d", "1w", "2h".
   * Mutually exclusive with endDate — used only when endDate is null.
   */
  duration: string | null
  /**
   * IDs of predecessor tasks. When set, start = max end date of all predecessors.
   * Emitted as "after id1 id2 ..." on export. Takes priority over startDate.
   */
  afterTaskIds: string[]
  /**
   * Optional URL for Mermaid click interaction.
   * Emitted as "click <id> href \"<url>\"" on export.
   */
  clickUrl: string | null
  /**
   * UI-only color for the task bar (hex string). Not exported to Mermaid syntax.
   * Falls back to STATUS_COLORS when null.
   */
  color: string | null
}

// ─── Section ─────────────────────────────────────────────────────────────────

export interface GanttSection {
  /** Internal identifier — never emitted in Mermaid syntax. */
  id: string
  /**
   * Section heading. Empty string = ungrouped (no "section" line emitted).
   */
  title: string
  tasks: GanttTask[]
}

// ─── Chart ───────────────────────────────────────────────────────────────────

export interface GanttChart {
  /** Chart title displayed above the diagram. */
  title: string
  /** Date format used for all task dates. */
  dateFormat: DateFormat
  /** Axis tick label format, e.g. "%b %d", "%Y-%m-%d". */
  axisFormat: string
  /** Tick interval, e.g. "1week", "1day". null = Mermaid default. */
  tickInterval: string | null
  /** Days/dates to exclude, e.g. "weekends", "monday". null = none. */
  excludes: string | null
  /** Whether to show the today marker line. */
  todayMarker: boolean
  /** Weekday for week start, e.g. "monday". null = Mermaid default. */
  weekday: string | null
  sections: GanttSection[]
}
