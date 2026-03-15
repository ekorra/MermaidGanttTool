import type { TimelineScale } from '../hooks/useTimelineScale'
import { HEADER_HEIGHT } from '../components/Canvas/TimelineHeader'
import { addDays, formatDate } from './dateUtils'

const TICK_INTERVAL_DAYS = 7
const DPR = 2 // HiDPI / retina

/** Replace all CSS custom property references (`var(--x)`) in element attributes with
 *  their computed values so the SVG is self-contained when serialised. */
function resolveCssVars(root: Element): void {
  const computed = getComputedStyle(document.documentElement)
  const resolve = (value: string): string =>
    value.replace(/var\(\s*(--[^)]+)\s*\)/g, (_, name: string) =>
      computed.getPropertyValue(name.trim()).trim() || 'transparent'
    )

  const elements = [root, ...root.querySelectorAll('*')]
  for (const el of elements) {
    const style = el.getAttribute('style')
    if (style) el.setAttribute('style', resolve(style))

    for (const attr of ['fill', 'stroke', 'color']) {
      const val = el.getAttribute(attr)
      if (val && val.includes('var(')) el.setAttribute(attr, resolve(val))
    }
  }
}

/** Build the timeline header as a standalone SVG <g> element. */
function buildHeaderGroup(
  scale: TimelineScale,
  isDark: boolean,
): SVGGElement {
  const ns = 'http://www.w3.org/2000/svg'
  const computed = getComputedStyle(document.documentElement)

  const headerBg = isDark
    ? '#12122a'
    : computed.getPropertyValue('--color-surface').trim() || '#ffffff'
  const borderColor = isDark
    ? 'rgba(255,255,255,0.08)'
    : computed.getPropertyValue('--color-border').trim() || '#e0e0e0'
  const tickColor = isDark
    ? 'rgba(255,255,255,0.15)'
    : computed.getPropertyValue('--color-border').trim() || '#e0e0e0'
  const labelColor = isDark
    ? 'rgba(255,255,255,0.4)'
    : computed.getPropertyValue('--color-text-muted').trim() || '#888888'

  const g = document.createElementNS(ns, 'g')

  const bg = document.createElementNS(ns, 'rect')
  bg.setAttribute('x', '0')
  bg.setAttribute('y', '0')
  bg.setAttribute('width', String(scale.canvasWidth))
  bg.setAttribute('height', String(HEADER_HEIGHT))
  bg.setAttribute('fill', headerBg)
  g.appendChild(bg)

  const border = document.createElementNS(ns, 'line')
  border.setAttribute('x1', '0')
  border.setAttribute('y1', String(HEADER_HEIGHT - 1))
  border.setAttribute('x2', String(scale.canvasWidth))
  border.setAttribute('y2', String(HEADER_HEIGHT - 1))
  border.setAttribute('stroke', borderColor)
  border.setAttribute('stroke-width', '1')
  g.appendChild(border)

  let cursor = new Date(scale.startDate)
  while (cursor <= scale.endDate) {
    const x = scale.dateToX(cursor)
    const label = formatDate(cursor)

    const tick = document.createElementNS(ns, 'line')
    tick.setAttribute('x1', String(x))
    tick.setAttribute('y1', String(HEADER_HEIGHT - 8))
    tick.setAttribute('x2', String(x))
    tick.setAttribute('y2', String(HEADER_HEIGHT))
    tick.setAttribute('stroke', tickColor)
    tick.setAttribute('stroke-width', '1')
    g.appendChild(tick)

    const text = document.createElementNS(ns, 'text')
    text.setAttribute('x', String(x + 3))
    text.setAttribute('y', String(HEADER_HEIGHT - 4))
    text.setAttribute('font-size', '10')
    text.setAttribute('fill', labelColor)
    text.setAttribute('font-family', 'system-ui, sans-serif')
    text.textContent = label
    g.appendChild(text)

    cursor = addDays(cursor, TICK_INTERVAL_DAYS)
  }

  return g
}

export interface ExportPngOptions {
  svgEl: SVGSVGElement
  scale: TimelineScale
  title: string
  includeTodayMarker: boolean
  isDark: boolean
}

/**
 * Export the canvas SVG as a PNG file download.
 * - Prepends the timeline header (reconstructed as SVG)
 * - Resolves all CSS custom properties to computed values
 * - Renders at 2× resolution for HiDPI sharpness
 * - Transparent background
 */
export async function exportPng({
  svgEl,
  scale,
  title,
  includeTodayMarker,
  isDark,
}: ExportPngOptions): Promise<void> {
  const ns = 'http://www.w3.org/2000/svg'
  const svgHeight = Number(svgEl.getAttribute('height') ?? svgEl.getBoundingClientRect().height)
  const totalHeight = HEADER_HEIGHT + svgHeight
  const width = scale.canvasWidth

  // Clone and resolve CSS vars in the existing SVG content
  const clone = svgEl.cloneNode(true) as SVGSVGElement
  resolveCssVars(clone)

  // Remove today marker if excluded
  if (!includeTodayMarker) {
    clone.querySelector('[data-today-marker]')?.remove()
  }

  // Compose the full SVG
  const fullSvg = document.createElementNS(ns, 'svg')
  fullSvg.setAttribute('xmlns', ns)
  fullSvg.setAttribute('width', String(width))
  fullSvg.setAttribute('height', String(totalHeight))
  fullSvg.setAttribute('viewBox', `0 0 ${width} ${totalHeight}`)

  fullSvg.appendChild(buildHeaderGroup(scale, isDark))

  const contentWrapper = document.createElementNS(ns, 'g')
  contentWrapper.setAttribute('transform', `translate(0, ${HEADER_HEIGHT})`)
  while (clone.firstChild) {
    contentWrapper.appendChild(clone.firstChild)
  }
  fullSvg.appendChild(contentWrapper)

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(fullSvg)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
  const svgUrl = URL.createObjectURL(svgBlob)

  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width * DPR
      canvas.height = totalHeight * DPR
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Could not get 2d context')); return }
      ctx.scale(DPR, DPR)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(svgUrl)

      canvas.toBlob(pngBlob => {
        if (!pngBlob) { reject(new Error('toBlob failed')); return }
        const filename = (title.replace(/[^\w\s-]/g, '').trim() || 'gantt') + '.png'
        const a = document.createElement('a')
        a.href = URL.createObjectURL(pngBlob)
        a.download = filename
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 2000)
        resolve()
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(svgUrl); reject(new Error('SVG failed to load')) }
    img.src = svgUrl
  })
}
