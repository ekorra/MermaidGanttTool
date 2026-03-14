export const TASK_ROW_HEIGHT = 36
const DIAMOND_SIZE = 12

// Status colours reused in TaskBar too
export const STATUS_COLORS: Record<string, string> = {
  active:       '#4361ee',
  done:         '#6c757d',
  crit:         '#dc3545',
  'crit+active':'#dc3545',   // red — crit dominates visually
  'crit+done':  '#8b2020',   // dark red — critical but completed
  milestone:    '#f4a261',
  default:      '#4cc9f0',
}

interface MilestoneMarkerProps {
  x: number
  label: string
  color?: string
}

export function MilestoneMarker({ x, label, color }: MilestoneMarkerProps) {
  const resolvedColor = color ?? STATUS_COLORS['milestone']!
  const cx = x
  const cy = TASK_ROW_HEIGHT / 2

  return (
    <g>
      <polygon
        points={`
          ${cx},${cy - DIAMOND_SIZE}
          ${cx + DIAMOND_SIZE},${cy}
          ${cx},${cy + DIAMOND_SIZE}
          ${cx - DIAMOND_SIZE},${cy}
        `}
        fill={resolvedColor}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.5}
      />
      <text
        x={cx + DIAMOND_SIZE + 4}
        y={cy + 4}
        fontSize={11}
        fill="#cdd6f4"
      >
        {label}
      </text>
    </g>
  )
}
