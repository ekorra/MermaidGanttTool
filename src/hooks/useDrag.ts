import { useCallback, useRef } from 'react'

interface UseDragOptions {
  onDragEnd: (deltaDays: number) => void
  pxPerDay: number
}

/**
 * Pointer-event based horizontal drag for SVG elements.
 * Returns event handlers to attach to an SVG element.
 * onDragEnd is called with the number of days to shift.
 * wasDragged() returns true if the last pointer interaction was a drag (>4px),
 * allowing callers to distinguish drag from click.
 */
export function useDrag({ onDragEnd, pxPerDay }: UseDragOptions) {
  const startX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent<SVGElement>) => {
    e.preventDefault()
    e.stopPropagation()
    startX.current = e.clientX
    isDragging.current = false
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<SVGElement>) => {
    if (startX.current === null) return
    const deltaX = e.clientX - startX.current
    if (Math.abs(deltaX) > 4) isDragging.current = true
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<SVGElement>) => {
    if (startX.current === null) return
    const deltaX = e.clientX - startX.current
    const deltaDays = Math.round(deltaX / pxPerDay)
    startX.current = null
    if (isDragging.current && deltaDays !== 0) {
      onDragEnd(deltaDays)
    }
    isDragging.current = false
  }, [onDragEnd, pxPerDay])

  /** True if the most recent pointer-down was followed by a drag (>4px). */
  const wasDragged = useCallback(() => isDragging.current, [])

  return { onPointerDown, onPointerMove, onPointerUp, wasDragged }
}
