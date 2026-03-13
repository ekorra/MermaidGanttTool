# MermaidGanttTool — Backlog

## In Progress

## Backlog

### Phase 2 — State + Shell
- [ ] Implement `useGanttStore` with sample initial data
- [ ] `App.tsx` three-panel layout (CSS Grid)
- [ ] `Toolbar` — title field + export-to-clipboard button
- [ ] `SyntaxPane` — read-only textarea + copy button
- [ ] Integration tests for `useGanttStore` — all mutators + `mermaidSyntax`
- [ ] Verify: change title in toolbar → syntax updates in real time

### Phase 3 — Editor Panel
- [ ] `SectionList` + `SectionRow` — add, rename, delete sections
- [ ] `TaskRow` — label, status dropdown, date inputs, duration, afterTaskId
- [ ] `EditableLabel` shared component
- [ ] E2E: `editor.spec.ts` — add/edit/delete sections and tasks

### Phase 4 — Canvas
- [ ] `useTimelineScale` hook + integration tests
- [ ] `TimelineHeader` — date axis rendering
- [ ] `TaskBar` — static rendering (position + width from model)
- [ ] `MilestoneMarker` — diamond at correct X position
- [ ] Integrate dnd-kit: horizontal drag, snap-to-day, update model on drop
- [ ] `useResize` — pointer-event resize handle on right edge of task bars
- [ ] `DependencyArrow` — SVG overlay after all bars are positioned
- [ ] E2E: `canvas.spec.ts` — drag changes startDate, resize changes duration

### Phase 5 — Preview
- [ ] `MermaidRenderer` — mermaid.js integration, 300ms debounce, error boundary
- [ ] `Preview.tsx` — tabs or split pane (syntax + rendered)
- [ ] E2E: `export.spec.ts` — copy button, verify Mermaid output

### Phase 6 — Hardening
- [ ] `localStorage` persistence (wrap `setChart` in the store)
- [ ] README with usage and contribution guide
- [ ] GitHub Actions CI: typecheck + unit + integration + E2E
- [ ] Review and clean up backlog

## Done

### Phase 1 — Foundation
- [x] Scaffold Vite + React + TypeScript project with Vitest and Playwright
- [x] Define core data model: `src/model/types.ts`
- [x] Implement factory functions: `src/model/defaults.ts`
- [x] Implement `exportToMermaid()`: `src/model/export.ts`
- [x] Implement date helpers: `src/utils/dateUtils.ts`
- [x] Implement ID generator: `src/utils/idUtils.ts`
- [x] Unit tests for `exportToMermaid()` — all task/section variants
- [x] Unit tests for `dateUtils` and `defaults`

## Ideas & Future
- Browser extension packaging (Chrome/Firefox)
- Export as PNG (via mermaid.js SVG → canvas → PNG)
- Import from existing Mermaid syntax (parse → model)
- Zoom control on canvas (pxPerDay slider)
- Keyboard navigation and accessibility
- Import from Jira/Linear CSV
- Multi-file / project tabs
- Collaborative editing via CRDT
- Dark mode
