---
id: TASK-44
title: Buy Me a Coffee — support link on info page
status: Done
assignee: []
created_date: '2026-03-14'
updated_date: '2026-03-14 19:20'
labels:
  - ux
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a Buy Me a Coffee badge to the info modal (`InfoPanel`). Uses a static badge image from the Buy Me a Coffee CDN — no external JS, no tracking widgets.

The URL is a placeholder (`https://www.buymeacoffee.com/YOUR_USERNAME`) that the developer replaces after creating an account.

**Implementation:**
- Add badge image + link at the bottom of `InfoPanel`
- Image: `https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png`
- Opens in new tab (`target="_blank" rel="noopener noreferrer"`)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Buy Me a Coffee badge is visible at the bottom of the info modal
- [ ] #2 Clicking the badge opens `https://www.buymeacoffee.com/YOUR_USERNAME` in a new tab
- [ ] #3 Badge URL is easy to find and replace in the source (add a `// TODO: replace with your BMC username` comment)
- [ ] #4 No external JS loaded — static image only
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
