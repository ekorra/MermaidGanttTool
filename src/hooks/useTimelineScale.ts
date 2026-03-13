import { useMemo } from 'react'
import type { GanttSection } from '../model/types'
import { addDays, diffDays } from '../utils/dateUtils'
import { resolveTaskPositions, getChartDateRange } from '../utils/taskPositions'

export const PX_PER_DAY = 40

export interface TimelineScale {
  pxPerDay: number
  startDate: Date
  endDate: Date
  totalDays: number
  canvasWidth: number
  dateToX: (date: Date) => number
  xToDate: (x: number) => Date
  durationToPx: (days: number) => number
  pxToDuration: (px: number) => number
}

export function useTimelineScale(sections: GanttSection[]): TimelineScale {
  return useMemo(() => {
    const positions = resolveTaskPositions(sections)
    const { start, end } = getChartDateRange(positions)
    const totalDays = Math.max(diffDays(start, end), 7)
    const canvasWidth = totalDays * PX_PER_DAY

    const dateToX = (date: Date): number =>
      diffDays(start, date) * PX_PER_DAY

    const xToDate = (x: number): Date =>
      addDays(start, Math.round(x / PX_PER_DAY))

    const durationToPx = (days: number): number => days * PX_PER_DAY

    const pxToDuration = (px: number): number =>
      Math.max(1, Math.round(px / PX_PER_DAY))

    return {
      pxPerDay: PX_PER_DAY,
      startDate: start,
      endDate: end,
      totalDays,
      canvasWidth,
      dateToX,
      xToDate,
      durationToPx,
      pxToDuration,
    }
  }, [sections])
}
