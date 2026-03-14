---
id: TASK-27
title: Today marker line on canvas SVG
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - canvas
  - ux
dependencies: []
---

## Description

The `todayMarker` flag already affects the exported Mermaid syntax. This task adds a visual today marker line on the canvas SVG itself so the user can see where today falls relative to their tasks while editing.

## Acceptance Criteria

- [ ] Vertical line drawn at `dateToX(today)` across the full canvas height
- [ ] Line only rendered when `chart.todayMarker === true`
- [ ] Distinct visual style: dashed or solid, accent color (e.g. `--color-primary`)
- [ ] "Today" label shown at the top of the line (in timeline header area)
- [ ] Line updates if the user changes the `todayMarker` toggle

## Definition of Done

- [ ] Today line rendered in `src/components/Canvas/Canvas.tsx`
- [ ] Toggled via existing `chart.todayMarker` field — no new model fields needed
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
