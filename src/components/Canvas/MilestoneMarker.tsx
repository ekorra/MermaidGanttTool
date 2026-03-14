export const TASK_ROW_HEIGHT = 36
const DIAMOND_SIZE = 12

export const STATUS_COLORS: Record<string, string> = {
  active:        '#4361ee',
  done:          '#6c757d',
  crit:          '#dc3545',
  'crit+active': '#dc3545',
  'crit+done':   '#8b2020',
  milestone:     '#f4a261',
  default:       '#4cc9f0',
}

interface MilestoneMarkerProps {
  x: number
  label: string
  color?: string
  selected?: boolean
  onSelect?: () => void
}

export function MilestoneMarker({ x, label, color, selected, onSelect }: MilestoneMarkerProps) {
  const resolvedColor = color ?? STATUS_COLORS['milestone']!
  const cx = x
  const cy = TASK_ROW_HEIGHT / 2

  return (
    <g onClick={onSelect} style={{ cursor: onSelect ? 'pointer' : undefined }}>
      {/* Selection ring */}
      {selected && (
        <polygon
          points={`
            ${cx},${cy - DIAMOND_SIZE - 3}
            ${cx + DIAMOND_SIZE + 3},${cy}
            ${cx},${cy + DIAMOND_SIZE + 3}
            ${cx - DIAMOND_SIZE - 3},${cy}
          `}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <polygon
        data-testid={`milestone-diamond-${label}`}
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
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  )
}
