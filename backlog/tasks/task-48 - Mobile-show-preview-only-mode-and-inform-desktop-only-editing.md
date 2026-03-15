---
id: TASK-48
title: 'Mobile: show preview-only mode and inform desktop-only editing'
status: Done
assignee: []
created_date: '2026-03-15 18:20'
updated_date: '2026-03-15 18:44'
labels:
  - ux
  - mobile
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The full editor (canvas drag/resize, 3-panel layout) is fundamentally a desktop experience
and is not worth porting to mobile. However, mobile users may open a shared link to view
a diagram, and should get a decent experience instead of a broken UI.

Two things:
1. **Detect mobile** and show a banner informing that editing requires a desktop browser
2. **On mobile with a shared link: show only the Mermaid preview** (rendered diagram) instead
   of the broken editor

Detection: use `window.matchMedia('(pointer: coarse)')` — true on touch devices.
More reliable than user-agent sniffing.

## Behaviour

- **Desktop** (pointer: fine): app works as normal, no changes
- **Mobile** (pointer: coarse) without share param:
  - Show full-screen message: "GanttMaker is designed for desktop. Open on a computer to
    create and edit diagrams."
- **Mobile with `?share=id`**:
  - Load the shared diagram
  - Show only the Mermaid preview renderer (read-only, no editing controls)
  - Small note: "Open on a desktop to edit this diagram"
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Mobile without share param: full-screen "desktop only" message shown
- [ ] #2 Mobile with `?share=id`: diagram loads and renders as Mermaid SVG, no editor
- [ ] #3 Desktop is completely unaffected by this change
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
