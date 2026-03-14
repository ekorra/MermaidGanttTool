import { TASK_ROW_HEIGHT } from './MilestoneMarker'

interface DependencyArrowProps {
  fromX: number  // right edge of source task bar
  fromRowY: number  // top of source task row (absolute in SVG coords)
  toX: number    // left edge of target task bar
  toRowY: number // top of target task row
}

export function DependencyArrow({ fromX, fromRowY, toX, toRowY }: DependencyArrowProps) {
  const midY1 = fromRowY + TASK_ROW_HEIGHT / 2
  const midY2 = toRowY + TASK_ROW_HEIGHT / 2
  const midX = (fromX + toX) / 2

  // Cubic bezier from right-center of source to left-center of target
  const d = `M ${fromX} ${midY1} C ${midX} ${midY1}, ${midX} ${midY2}, ${toX} ${midY2}`

  return (
    <g data-testid="dependency-arrow" style={{ pointerEvents: 'none' }}>
      <path
        d={d}
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        markerEnd="url(#arrowhead)"
      />
    </g>
  )
}

/** SVG <defs> block — render once inside the canvas SVG */
export function ArrowDefs() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth={8}
        markerHeight={6}
        refX={8}
        refY={3}
        orient="auto"
      >
        <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted)" />
      </marker>
    </defs>
  )
}
