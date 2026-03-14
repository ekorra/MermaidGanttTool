---
id: TASK-37
title: 'Info page — app features, limitations, and Mermaid.js links'
status: Done
assignee: []
created_date: '2026-03-14'
updated_date: '2026-03-14 13:22'
labels:
  - ux
  - docs
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
An info modal accessible via a `?` button in the toolbar. Explains what the app does, key features, current limitations, Mermaid.js benefits, and links to relevant resources. Implemented as a modal overlay — no router needed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `?` button in the toolbar opens the info modal
- [ ] #2 Modal has: what the app does, features list, limitations, Mermaid.js benefits, links
- [ ] #3 Closes via ✕ button and clicking the backdrop
- [ ] #4 Fully themed — uses CSS variables (works in both light and dark mode)
- [ ] #5 No new dependencies
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Implemented in `src/components/shared/InfoPanel.tsx`
- [ ] #2 Toolbar updated with `?` button
- [ ] #3 App.tsx wires `infoOpen` state
- [ ] #4 TypeScript strict — no errors (`npm run typecheck`)
- [ ] #5 Tests passing (`npm run test:run`)
- [ ] #6 Committed and pushed
<!-- DOD:END -->
