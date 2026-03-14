---
id: TASK-40
title: Click task in canvas opens detail panel + improved drag/resize handles
status: Done
assignee: []
created_date: '2026-03-14 17:54'
updated_date: '2026-03-14 18:29'
labels:
  - ux
  - canvas
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Three related UX improvements to task interaction in the canvas:

**1. Click to open detail panel**
Clicking a task bar or milestone opens the TaskDetailPanel (right column). The `onSelect` prop is already wired — this ensures the panel visibly opens and the task is highlighted in the task list.

**2. Move entire task bar by dragging**
Click-and-hold anywhere on the task bar body (not the edge handles) drags the entire task forward or backward in time. Tasks connected via `afterTaskIds` follow automatically since their start is computed from the dependency's end date (already handled by `resolveTaskPositions`).

**3. Wider resize handles on both edges**
The current right-edge handle is a 6px sliver — hard to hit. Both edges should have a minimum 12px invisible hit area with `ew-resize` cursor.
- **Right edge drag**: changes `endDate`/`duration` (existing behaviour)
- **Left edge drag**: changes `startDate`, right edge stays fixed (shorter/longer task)
- If left-edge drag causes `startDate` to pass `endDate`, a confirmation dialog appears:
  - **Yes (delete)**: task is removed
  - **No (revert)**: task snaps back to its original length before the drag started
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Clicking a task bar or milestone opens the TaskDetailPanel for that task
- [ ] #2 Detail panel closes only via the × button or by clicking the canvas background (not by re-clicking the task)
- [ ] #3 Dragging the task bar body moves the entire task in time (snap to day)
- [ ] #4 Tasks with `afterTaskIds` pointing to the moved task reposition automatically
- [ ] #5 Right edge drag handle hit area is at least 12px wide
- [ ] #6 Left edge drag handle changes `startDate` (right edge fixed), hit area at least 12px wide
- [ ] #7 Cursor shows `ew-resize` when hovering either edge handle
- [ ] #8 Left-edge drag past `endDate` shows a confirmation dialog — Yes deletes, No reverts to original size
- [ ] #9 Click vs. drag distinction: movement < 4px counts as a click, not a drag
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
