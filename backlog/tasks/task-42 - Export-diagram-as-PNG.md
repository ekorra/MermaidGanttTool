---
id: TASK-42
title: Export diagram as PNG
status: Done
assignee: []
created_date: '2026-03-13'
updated_date: '2026-03-15 06:09'
labels:
  - ux
  - export
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a "Download PNG" button in the toolbar that exports the full Gantt diagram as a PNG file.

**Technical approach:**
1. Clone the canvas SVG element
2. Resolve all CSS custom properties (`var(--...)`) to their computed values via `getComputedStyle` — CSS variables are not available in standalone SVG images
3. Prepend timeline header as SVG elements (month labels, week markers) reconstructed from the existing `scale` data — the current `TimelineHeader` is a `<div>` outside the SVG and would be lost in a plain SVG export
4. Draw the final SVG onto an HTML `<canvas>` at 2× resolution for crisp display on HiDPI/retina screens
5. Call `canvas.toBlob('image/png')` and trigger `<a download="<title>.png">` download

**Export options (shown in a small modal before downloading):**
- **Include today marker** — toggle, default off (it's a "live view" element, not meaningful in a static image)
- Clipboard copy can be added later as an extension

**Color handling:**
- Task bar colors (explicit hex values set by the user) are preserved automatically
- Grid, section backgrounds, and text: CSS variables resolved to computed values at export time
- Canvas background: **transparent** — allows the PNG to be placed on any background

**What NOT to do:**
- No `html2canvas` dependency — too unreliable and heavy
- No server-side rendering
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Toolbar has a "Download PNG" button
- [ ] #2 Clicking it opens a small export options modal (today marker toggle)
- [ ] #3 Exported PNG includes the timeline header (month/week labels and date axis)
- [ ] #4 Task bar colors are preserved in the export
- [ ] #5 Canvas background is transparent
- [ ] #6 Grid lines and section backgrounds use their resolved (non-variable) colors
- [ ] #7 PNG is exported at 2× resolution for HiDPI sharpness
- [ ] #8 File is saved as `<chart-title>.png`
- [ ] #9 Works in Chrome, Firefox, and Safari
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
