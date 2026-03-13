import { useCallback, useRef } from 'react'

interface UseResizeOptions {
  onResizeEnd: (deltaDays: number) => void
  pxPerDay: number
}

/**
 * Returns a `onPointerDown` handler to attach to a resize handle element.
 * Tracks horizontal pointer movement and calls onResizeEnd with the
 * number of days to add/subtract from the task duration.
 */
export function useResize({ onResizeEnd, pxPerDay }: UseResizeOptions) {
  const startX = useRef<number | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startX.current = e.clientX
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((_e: React.PointerEvent) => {
    // Visual feedback could be added here in a future iteration
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (startX.current === null) return
    const deltaX = e.clientX - startX.current
    const deltaDays = Math.round(deltaX / pxPerDay)
    startX.current = null
    if (deltaDays !== 0) onResizeEnd(deltaDays)
  }, [onResizeEnd, pxPerDay])

  return { onPointerDown, onPointerMove, onPointerUp }
}
