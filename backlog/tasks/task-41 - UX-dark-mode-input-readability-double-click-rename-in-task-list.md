---
id: TASK-41
title: 'UX: dark mode input readability + double-click rename in task list'
status: Done
assignee: []
created_date: '2026-03-14 18:35'
updated_date: '2026-03-14 18:43'
labels:
  - ux
  - dark-mode
  - accessibility
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Two UX improvements:

**1. Dark mode: unreadable text in inputs (TaskDetailPanel)**
`inputStyle` in `TaskDetailPanel.tsx` sets `background: var(--color-bg)` but no explicit `color`. In dark mode `--color-bg` is `#13131f` (near-black), causing text to render black-on-black. All form fields (Navn, Status, Start, Slutt, Varighet, Lenke) need `color: var(--color-text)` to be WCAG AA compliant in both themes.

**2. Double-click to rename task or section in task list**
Currently in the left task list panel:
- Clicking a **task** opens the detail panel (correct)
- Clicking a **section header** immediately enters inline rename mode via `EditableLabel` (too sensitive — easy to trigger by accident)

Change to double-click for rename:
- **Tasks**: double-click on the task label in the list opens a small inline input directly in the list row, commits on Enter/blur, cancels on Escape. Single-click still selects and opens the detail panel.
- **Sections**: change `EditableLabel` trigger from single-click to double-click, so single-click no longer accidentally starts editing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 In dark mode, all input/select fields in TaskDetailPanel have readable text (`color: var(--color-text)`)
- [ ] #2 Contrast meets WCAG AA (4.5:1) for text on `--color-bg` in dark mode
- [ ] #3 Double-clicking a task label in the task list opens an inline rename input in the list row
- [ ] #4 Rename commits on Enter or blur, cancels on Escape, updates the model via `updateTask`
- [ ] #5 Double-clicking a section header enters rename mode (single-click no longer triggers it)
- [ ] #6 Single-click on a task still selects it and opens the detail panel
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
