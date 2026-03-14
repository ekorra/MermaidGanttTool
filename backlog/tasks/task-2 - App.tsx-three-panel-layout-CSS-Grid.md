---
id: TASK-2
title: App.tsx three-panel layout (CSS Grid)
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 08:57'
labels:
  - phase-2
dependencies: []
---

## Description

Wire all components together in `App.tsx` using CSS Grid. Three-panel layout: left editor, centre canvas, right task detail. Bottom preview pane for Mermaid syntax/rendered output.

## Acceptance Criteria

- [x] CSS Grid layout with Toolbar (48px) + main row + Preview (220px)
- [x] Left panel: TaskList (280px fixed)
- [x] Centre: Canvas (1fr, fills remaining space)
- [x] Right panel: TaskDetailPanel (240px, visible when task selected)
- [x] All panels receive state/mutators from `useGanttStore`
- [x] Responsive — no horizontal scroll on 1280px+ screens

## Definition of Done

- [x] `src/App.tsx` wires all panels
- [x] `src/styles/global.css` defines layout CSS variables
- [x] App renders without console errors
