---
id: TASK-30
title: Settings panel — dateFormat, weekday, excludes, todayMarker
status: To Do
assignee: []
created_date: '2026-03-14'
labels:
  - ux
  - settings
dependencies: []
---

## Description

Move chart-level configuration out of the toolbar into a dedicated settings panel (modal or slide-in). Exposes `dateFormat`, `weekday`, `excludes`, `todayMarker`, `axisFormat`, and `tickInterval` in one place so the toolbar stays clean.

## Acceptance Criteria

- [ ] Settings button (gear icon) in toolbar opens a settings panel
- [ ] Panel fields: Title, Date format, Axis format, Tick interval, Excludes, Today marker toggle, Weekday (new — `weekday monday/tuesday/...`)
- [ ] `GanttChart.weekday: string | null` added to model
- [ ] `exportToMermaid()` emits `weekday <value>` when set
- [ ] All fields update the chart via `updateChartMeta`
- [ ] Panel closes on save or outside click
- [ ] `resolveTaskPositions()` is not affected (weekday is a rendering hint for Mermaid, not a layout constraint in our canvas)

## Definition of Done

- [ ] `src/model/types.ts` updated with `weekday: string | null`
- [ ] `src/model/export.ts` updated
- [ ] `src/model/defaults.ts` updated (weekday: null in createChart)
- [ ] Settings panel component implemented
- [ ] Toolbar simplified (title input remains, rest moved to settings)
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
