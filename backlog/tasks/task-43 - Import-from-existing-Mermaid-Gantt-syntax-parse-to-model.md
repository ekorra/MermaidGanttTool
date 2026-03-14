---
id: TASK-43
title: Import from existing Mermaid Gantt syntax (parse to model)
status: Done
assignee: []
created_date: '2026-03-13'
updated_date: '2026-03-14 21:43'
labels:
  - ux
  - import
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a "Paste from clipboard" button in the toolbar. When clicked, reads the clipboard and — if it contains valid Mermaid Gantt syntax — shows a confirmation dialog before importing and replacing the current diagram.

**Flow:**
1. User clicks "Paste Mermaid" in toolbar
2. `navigator.clipboard.readText()` is called (user gesture grants permission)
3. If text starts with `gantt` → show confirm dialog: *"Found Mermaid Gantt syntax in clipboard — import and replace current diagram?"*
4. Yes → parse to model, replace store state
5. No / invalid clipboard → show brief error message

**Parser (`src/model/import.ts`):**
Parses the subset of Mermaid Gantt syntax that the app can export:
- `title <text>`
- `dateFormat <format>`
- `axisFormat <format>`
- `tickInterval <interval>`
- `excludes <days>`
- `todayMarker off` / `weekday <day>`
- `section <title>` (empty title = ungrouped)
- Task lines: `<label> : [status,] [id,] <start|after ref>, <end|duration>`

Unknown directives are silently skipped. The parser only needs to handle what `exportToMermaid()` produces — round-trip fidelity is the goal, not full Mermaid spec coverage.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Toolbar has a "Paste Mermaid" button
- [ ] #2 Clicking reads clipboard and detects valid Mermaid Gantt syntax (starts with `gantt`)
- [ ] #3 Confirmation dialog shown before replacing the current diagram
- [ ] #4 Imported chart matches what `exportToMermaid()` would produce for the same model
- [ ] #5 Invalid or non-Mermaid clipboard content shows a user-friendly error
- [ ] #6 `src/model/import.ts` — pure TypeScript, zero React imports
- [ ] #7 Round-trip: `exportToMermaid(parseGantt(syntax))` ≈ `syntax` for all supported fields
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Unit tests for `parseGantt()` covering all supported directives and task formats
- [ ] #3 Tests passing (`npm run typecheck && npm run test:run`)
- [ ] #4 Committed and pushed
<!-- DOD:END -->
