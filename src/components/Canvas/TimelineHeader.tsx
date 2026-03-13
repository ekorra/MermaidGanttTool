import type { TimelineScale } from '../../hooks/useTimelineScale'
import { addDays, formatDate } from '../../utils/dateUtils'

interface TimelineHeaderProps {
  scale: TimelineScale
  dark?: boolean
}

export const HEADER_HEIGHT = 40
const TICK_INTERVAL_DAYS = 7 // one tick per week

export function TimelineHeader({ scale, dark }: TimelineHeaderProps) {
  const ticks: Array<{ x: number; label: string }> = []
  let cursor = new Date(scale.startDate)

  while (cursor <= scale.endDate) {
    ticks.push({
      x: scale.dateToX(cursor),
      label: formatDate(cursor),
    })
    cursor = addDays(cursor, TICK_INTERVAL_DAYS)
  }

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      height: HEADER_HEIGHT,
      width: scale.canvasWidth,
      background: dark ? '#12122a' : 'var(--color-surface)',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '2px solid var(--color-border)',
      flexShrink: 0,
    }}>
      {ticks.map(tick => (
        <div
          key={tick.label}
          style={{
            position: 'absolute',
            left: tick.x,
            top: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Tick line */}
          <div style={{
            width: 1,
            height: 8,
            background: dark ? 'rgba(255,255,255,0.15)' : 'var(--color-border)',
            marginTop: 'auto',
          }} />
          {/* Label */}
          <span style={{
            fontSize: 10,
            color: dark ? 'rgba(255,255,255,0.4)' : 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
            paddingLeft: 3,
            paddingBottom: 4,
          }}>
            {tick.label}
          </span>
        </div>
      ))}
    </div>
  )
}
